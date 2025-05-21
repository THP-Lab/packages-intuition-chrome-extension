/* eslint-disable @typescript-eslint/no-explicit-any */

import { MIN_DEPOSIT, MULTIVAULT_CONTRACT_ADDRESS } from '@consts/general'
import { multivaultAbi } from '@lib/abis/multivault'
import logger from '@lib/utils/logger'
import { truncateString } from '@lib/utils/misc'
import { Thing, WithContext } from 'schema-dts'
import { encodeFunctionData, parseUnits, toHex } from 'viem'

import {
  batchCreateAtomRequest,
  batchCreateAtoms,
  batchCreateTripleRequest,
  batchCreateTriples,
  checkAtomExists,
  getOrCreateAtom,
  getOrCreateTriple,
} from './attestor'
import { precomputeCID } from './cid'
import { estimateGas, getSender } from './evm'
import { checkImageAlreadyUploaded, resolveAndFilterImage } from './image'
import {
  getAtomID,
  getAtomURI,
  getTripleID,
  getURIData,
} from './offchain-store'
import { pinataPinJSON } from './pinata'
import { createRequest, pushUpdate, updateRequest } from './request'
import { appendToAtomLog, appendToTripleLog } from './supabase'

export async function populateAtom(obj: any) {
  try {
    const msgSender = await getSender()
    const [filteredObj, cid] = await pinAtomData(obj)
    obj = filteredObj
    const [atomID, txID] = await getOrCreateAtom(`ipfs://${cid}`)
    await appendToAtomLog(atomID, cid, txID, obj, msgSender)
    return atomID
  } catch (error) {
    console.error('Error populating atom:', error)
  }
}

export async function pinAtomData(obj: any, requestHash?: string) {
  try {
    // Avoid re-uploading images that have already been uploaded
    obj.image = await resolveAndFilterImage(obj.image, requestHash)
    return [obj, await pinataPinJSON(obj, requestHash)]
  } catch (error) {
    console.error('Error pinning atom data:', error)
    requestHash
      ? await pushUpdate(requestHash, `Error pinning atom data: ${error}`)
      : null
  }
  return [obj, '']
}

export async function populateTriple(
  subjectId: string,
  predicateId: string,
  objectId: string,
) {
  try {
    const msgSender = await getSender()
    const [tripleID, txID] = await getOrCreateTriple(
      subjectId,
      predicateId,
      objectId,
    )
    console.log('Triple ID: ', tripleID)
    await appendToTripleLog(
      tripleID,
      txID,
      subjectId,
      predicateId,
      objectId,
      msgSender,
    )
    return tripleID
  } catch (error) {
    console.error('Error populating triple:', error)
  }
}

export interface TagAtomIDsResponse {
  newTripleIds: string[]
  existingTripleIds: string[]
}

export async function tagAtomIDs(
  tag: WithContext<Thing>,
  atomIds: string[],
  requestHash?: string,
) {
  const response: TagAtomIDsResponse = {
    newTripleIds: [],
    existingTripleIds: [],
  }
  try {
    const msgSender = await getSender()
    // Create a bunch of triples for each atom given the tag
    console.log('Preparing create triples request...')
    requestHash
      ? await pushUpdate(requestHash, 'Preparing create triples request...')
      : null
    const triples = await prepareTriplesFromTagAndAtomIDs(
      tag,
      atomIds,
      requestHash,
    )

    // Check if any triples already exist and remove them from the batch request
    console.log('Checking for existing triples...')
    requestHash
      ? await pushUpdate(requestHash, 'Checking for existing triples...')
      : null
    // eslint-disable-next-line prefer-const
    let [newTriples, existingTriples] = await cullExistingTriples(triples, 100)

    // console.log("New Triples: ", newTriples);
    // console.log("Existing Triples: ", existingTriples);

    // Batch create triples
    console.log('Tagging atoms...')
    requestHash ? await pushUpdate(requestHash, 'Tagging atoms...') : null
    // const txID = await batchCreateTriples(newTriples.map((triple) => triple.subjectId), newTriples.map((triple) => triple.predicateId), newTriples.map((triple) => triple.objectId));
    const txIDs = await processBatchTriples(newTriples, requestHash)
    const txID = txIDs.join(' ') // temporary fix before we create objects for each atom and assign a txID to each along with other data

    // Verify their IDs and log them
    console.log('Verifying new triple IDs...')
    requestHash
      ? await pushUpdate(requestHash, 'Verifying new triple IDs...')
      : null
    newTriples = await getTripleIdsFromTripleData(newTriples, 100)
    response.newTripleIds = newTriples.map(
      (triple) => triple.tripleId,
    ) as string[]
    newTriples.forEach(
      async (triple) =>
        await appendToTripleLog(
          triple.tripleId as string,
          txID,
          triple.subjectId,
          triple.predicateId,
          triple.objectId,
          msgSender,
        ),
    )

    console.log('Done tagging atoms.')
    requestHash ? await pushUpdate(requestHash, 'Done tagging atoms.') : null
    response.existingTripleIds = existingTriples.map(
      (triple) => triple.tripleId,
    ) as string[]

    return response
  } catch (error) {
    console.error('Error tagging atoms:', error)
  }
  return response
}

export interface PopulateAndTagAtomsResponse {
  newAtomIDs: string[]
  existingAtomIDs: string[]
  newTripleIds: string[]
  existingTripleIds: string[]
}

export async function requestPopulateAndTagAtoms(
  atoms: any[],
  tag: WithContext<Thing>,
) {
  try {
    const msgSender = await getSender()
    const requestHash = await createRequest(atoms, msgSender, 'createTriples')
    populateAndTagAtoms(atoms, tag, requestHash)
    return requestHash
  } catch (error) {
    console.error('Error populating and tagging atoms:', error)
  }
}

export async function populateAndTagAtoms(
  atoms: any[],
  tag: WithContext<Thing>,
  requestHash?: string,
) {
  const response: PopulateAndTagAtomsResponse = {
    newAtomIDs: [],
    existingAtomIDs: [],
    newTripleIds: [],
    existingTripleIds: [],
  }
  // Populate any new atoms
  const populateResponse = await populateAtoms(atoms, requestHash, false)
  response.newAtomIDs = populateResponse.newAtomIDs
  response.existingAtomIDs = populateResponse.existingAtomIDs

  // Tag all provided atoms, both new and pre-existing
  const tagResponse = await tagAtomIDs(
    tag,
    [...populateResponse.newAtomIDs, ...populateResponse.existingAtomIDs],
    requestHash,
  )
  response.newTripleIds = tagResponse.newTripleIds
  response.existingTripleIds = tagResponse.existingTripleIds

  requestHash ? await updateRequest(requestHash, { status: 'fulfilled' }) : null

  return response
}

export interface PopulateAtomsResponse {
  newAtomIDs: string[]
  existingAtomIDs: string[]
}

export async function requestPopulateAtoms(atoms: any[]) {
  const msgSender = await getSender()
  const requestHash = await createRequest(atoms, msgSender, 'createAtoms')
  populateAtoms(atoms, requestHash, true)
  return requestHash
}

export async function createPopulateAtomsRequest(atoms: any[]) {
  const msgSender = await getSender()
  const requestHash = await createRequest(atoms, msgSender, 'createAtoms')
  return requestHash
}

export async function pinAtoms(
  atoms: any[],
  requestHash?: string,
): Promise<{
  existingCIDs: string[]
  newCIDs: string[]
  filteredData: PinDataResult[]
  existingData: PinDataResult[]
}> {
  await pushUpdate(requestHash, 'Pinning new data to IPFS...')
  const pinnedData = requestHash
    ? await pinAllData(atoms, 100, 3, 1000, requestHash)
    : await pinAllData(atoms, 100)

  logger(`Checking for existing atoms...`)
  await pushUpdate(requestHash, 'Checking for existing atoms...')
  const [filteredData, existingData] = requestHash
    ? await cullExistingAtoms(pinnedData, 100, 3, requestHash)
    : await cullExistingAtoms(pinnedData, 100, 3)

  const newCIDs = filteredData.map((data) => data.cid)
  const existingCIDs = existingData.map((data) => data.cid)

  logger(`Done pinning atoms.`)
  await pushUpdate(requestHash, 'Done pinning atoms.')
  return { existingCIDs, newCIDs, filteredData, existingData }
}

export async function buildChunks(
  cids: string[],
  requestHash?: string,
): Promise<{ chunks: string[][]; chunkSize: number }> {
  console.log('Processing batch atoms with CIDs: ', cids)
  await pushUpdate(requestHash, `Processing batch atoms with CIDs: ${cids}`)
  if (cids.length === 0) {
    await pushUpdate(requestHash, 'No new atoms to create')
    console.log('No new atoms to create')
    return { chunks: [], chunkSize: 0 }
  }

  // Attempt static execution in iteratively smaller chunks until it either succeeds or we have reason to believe the revert is not due to out of gas
  console.log('Predetermining number of chunks to process batch atoms...')
  await pushUpdate(
    requestHash,
    'Predetermining number of chunks to process batch atoms...',
  )

  let numChunks = 1

  if (cids.length > 1) {
    let staticExecutionReverted = true
    let latestBatch: string[] = [] // for debugging
    while (staticExecutionReverted && numChunks < cids.length) {
      try {
        const chunkSize = Math.ceil(cids.length / numChunks)
        const chunks = chunk(cids, chunkSize)
        for (const batch of chunks) {
          latestBatch = batch // for debugging
          const request = batchCreateAtomRequest(batch)
          const gasEstimate = await estimateGas(request)
          if (gasEstimate > 30000000) {
            throw new Error(
              'Gas estimate for batch atoms will likely exceed block gas limit',
            )
          }
        }
        staticExecutionReverted = false
      } catch (error) {
        console.log(
          'Batch failed gas estimation, chunking further: ',
          latestBatch,
        )
        await pushUpdate(requestHash, `Reducing chunks: ${latestBatch}`)
        numChunks++
      }
    }

    if (staticExecutionReverted) {
      await pushUpdate(
        requestHash,
        'static execution reverted with chunk size of 1',
      )
      throw new Error('static execution reverted with chunk size of 1')
    }
  }

  const chunkSize = Math.ceil(cids.length / numChunks)
  const chunks = chunk(cids, chunkSize)
  console.log('Number of batch atom chunks: ', numChunks)
  await pushUpdate(requestHash, `Number of batch atom chunks: ${numChunks}`)
  console.log(
    'Chunk lengths: ',
    chunks.map((chunk) => chunk.length),
  )
  await pushUpdate(
    requestHash,
    `Chunk lengths: ${chunks.map((chunk) => chunk.length)}`,
  )
  return { chunks, chunkSize }
}

export type BatchAtomsRequest = {
  to: `0x${string}`
  data: `0x${string}`
  value: string
}
export function getBatchAtomsCall(
  cids: string[],
): BatchAtomsRequest | undefined {
  const minDeposit = parseUnits(MIN_DEPOSIT, 18).toString()
  if (cids.length !== 0) {
    return {
      to: MULTIVAULT_CONTRACT_ADDRESS as `0x${string}`,
      data: encodeFunctionData({
        abi: multivaultAbi,
        functionName: 'batchCreateAtom',
        args: [cids.map((cid) => toHex(cid))],
      }),
      value: (BigInt(minDeposit) * BigInt(cids.length)).toString(),
    }
  }
}

export async function generateBatchAtomsCalldata(
  cids: string[],
  requestHash?: string,
): Promise<{
  chunks: string[][]
  chunkSize: number
  calls: BatchAtomsRequest[]
}> {
  const { chunks, chunkSize } = await buildChunks(cids, requestHash)
  const calls = chunks
    .map((batch) => getBatchAtomsCall(batch))
    .filter((call): call is BatchAtomsRequest => call !== undefined)

  if (calls.length > 0) {
    await pushUpdate(
      requestHash,
      `\nGenerated ${calls.length} batch atom calls:\n${calls.map((call) => call.data).join('\n')}`,
    )
  }
  return { chunks, chunkSize, calls }
}

export async function populateAtoms(
  atoms: any[],
  requestHash?: string,
  concludeRequest?: boolean,
): Promise<PopulateAtomsResponse> {
  try {
    requestHash
      ? await updateRequest(requestHash, { status: 'processing' })
      : null
    const msgSender = await getSender()

    // Pin all data in parallel threads
    console.log('Pinning new data to IPFS...')
    requestHash
      ? await pushUpdate(requestHash, 'Pinning new data to IPFS...')
      : null
    const pinnedData = requestHash
      ? await pinAllData(atoms, 100, 3, 1000, requestHash)
      : await pinAllData(atoms, 100)

    // Check if any atoms already exist and remove them from the batch request (it will revert otherwise)
    console.log('Checking for existing atoms...')
    requestHash
      ? await pushUpdate(requestHash, 'Checking for existing atoms...')
      : null
    const [filteredData, existingData] = requestHash
      ? await cullExistingAtoms(pinnedData, 100, 3, requestHash)
      : await cullExistingAtoms(pinnedData, 100, 3)

    // Pare out the CIDs from the filtered data for batch population
    const filteredCIDs = filteredData.map((data) => data.cid)
    const oldAtomCIDs = existingData.map((data) => data.cid)

    // Batch create atoms
    console.log('Creating new atoms...')
    requestHash ? await pushUpdate(requestHash, 'Creating new atoms...') : null
    const txIDs = requestHash
      ? await processBatchAtoms(filteredCIDs, requestHash)
      : await processBatchAtoms(filteredCIDs)

    const txID = txIDs.join(' ') // temporary fix before we create objects for each atom and assign a txID to each along with other data

    // send the txHash from previous step as txId
    // we need to use the new CIDs
    // new cids are the filtered cids

    // Verify atom IDs from URIs
    console.log('Verifying new atom IDs...')
    requestHash
      ? await pushUpdate(requestHash, 'Verifying new atom IDs...')
      : null
    const newAtoms = await getAtomIdsFromURI(filteredCIDs, 100)
    const newAtomIDs = newAtoms.map((atom) => atom.atomId)

    // Append to atom log
    console.log('Logging new atoms to database...')
    requestHash
      ? await pushUpdate(requestHash, 'Logging new atoms to database...')
      : null
    newAtoms.forEach(
      async (atom) =>
        await appendToAtomLog(
          atom.atomId,
          atom.uri,
          txID, // txHash from previous step
          filteredData[atom.originalIndex].filteredObj,
          msgSender, // from the privy auth'd user (smart wallet)
        ),
    )

    // Verify old atom IDs from URIs
    console.log('Verifying old atom IDs...')
    requestHash
      ? await pushUpdate(requestHash, 'Verifying old atom IDs...')
      : null
    const oldAtoms = await getAtomIdsFromURI(oldAtomCIDs, 100)
    const existingAtomIDs = oldAtoms.map((atom) => atom.atomId)

    // Return the new and existing atom IDs
    console.log('Done populating atoms.')
    requestHash ? await pushUpdate(requestHash, 'Done populating atoms.') : null
    requestHash && concludeRequest
      ? await updateRequest(requestHash, { status: 'fulfilled' })
      : null
    return { newAtomIDs, existingAtomIDs } as PopulateAtomsResponse
  } catch (error) {
    requestHash
      ? await pushUpdate(requestHash, `Error populating atoms: ${error}`)
      : null
    requestHash ? await updateRequest(requestHash, { status: 'failed' }) : null
    console.error('Error populating atoms:', error)
  }
  return { newAtomIDs: [], existingAtomIDs: [] } as PopulateAtomsResponse
}

export async function logTransactionHashAndVerifyAtoms(
  txHash: string,
  filteredCIDs: string[],
  filteredData: PinDataResult[],
  msgSender: `0x${string}`,
  oldAtomCIDs: string[],
  requestHash?: string,
): Promise<PopulateAtomsResponse> {
  console.log(`Logging transaction hash: ${txHash}`)

  await pushUpdate(requestHash, `Logging transaction hash: ${txHash}`)

  // TODO: Implement actual logging logic here
  // This could involve writing to a file, sending to an API, or updating a database
  // For now, we'll just log to the console
  console.log(`Transaction hash ${txHash} logged successfully`)

  // Verify atom IDs from URIs
  console.log('Verifying new atom IDs...')
  if (requestHash) {
    await pushUpdate(requestHash, 'Verifying new atom IDs...')
  }
  const newAtoms = await getAtomIdsFromURI(filteredCIDs, 100)

  // Append to atom log
  console.log('Logging new atoms to database...')
  if (requestHash) {
    await pushUpdate(requestHash, 'Logging new atoms to database...')
  }

  for (const atom of newAtoms) {
    const filteredObj = filteredData.find(
      (data) => data.cid === atom.uri,
    )?.filteredObj

    if (filteredObj) {
      await appendToAtomLog(
        atom.atomId,
        atom.uri,
        txHash,
        filteredObj,
        msgSender,
      )
    } else {
      console.warn(`No filtered object found for atom with URI: ${atom.uri}`)
    }
  }

  // Verify old atom IDs from URIs
  console.log('Verifying old atom IDs...')
  if (requestHash) {
    await pushUpdate(requestHash, 'Verifying old atom IDs...')
  }
  const oldAtoms = await getAtomIdsFromURI(oldAtomCIDs, 100)

  console.log('Done verifying and logging new atoms.')
  if (requestHash) {
    await pushUpdate(requestHash, 'Done verifying and logging new atoms.')
  }

  const newAtomIDs = newAtoms.map((atom) => atom.atomId)
  const existingAtomIDs = oldAtoms.map((atom) => atom.atomId)

  if (requestHash) {
    await updateRequest(requestHash, { status: 'fulfilled' })
  }

  return { newAtomIDs, existingAtomIDs } as PopulateAtomsResponse
}

export async function checkAtomsExist(
  atoms: any[],
): Promise<AtomExistsResult[]> {
  const atomExistsResults = await processCheckAtomsExist(atoms, 100, 3, 1000)
  return atomExistsResults
}

export async function prepareTag(
  tag: WithContext<Thing>,
  requestHash?: string,
) {
  const msgSender = await getSender()
  requestHash
    ? await pushUpdate(requestHash, 'Fetching keywords predicate atom...')
    : null
  const [keywordsPredicateAtomID, keywordsPredicateTxID] =
    await getOrCreateAtom('https://schema.org/keywords')

  await appendToAtomLog(
    keywordsPredicateAtomID,
    'https://schema.org/keywords',
    keywordsPredicateTxID,
    {},
    msgSender,
  )

  // Avoid re-uploading images that have already been uploaded
  if ('image' in tag && typeof tag.image === 'string') {
    tag.image = await resolveAndFilterImage(tag.image, requestHash)
  }

  requestHash ? await pushUpdate(requestHash, 'Pinning tag atom...') : null
  const tagCID = await pinataPinJSON(tag)
  requestHash ? await pushUpdate(requestHash, `${tagCID} Pinned`) : null
  const [tagAtomID, tagTxID] = await getOrCreateAtom(`ipfs://${tagCID}`)

  await appendToAtomLog(tagAtomID, tagCID, tagTxID, tag, msgSender)

  console.log('Tag Atom ID: ', tagAtomID)
  console.log('keywordsPredicateAtomID: ', keywordsPredicateAtomID)
  requestHash
    ? await pushUpdate(requestHash, `Tag Atom ID: ${tagAtomID}`)
    : null
  requestHash
    ? await pushUpdate(
        requestHash,
        `Keywords Predicate Atom ID: ${keywordsPredicateAtomID}`,
      )
    : null

  return [keywordsPredicateAtomID, tagAtomID]
}

export async function prepareTriplesFromTagAndAtomIDs(
  tag: WithContext<Thing>,
  atomIDs: string[],
  requestHash?: string,
) {
  const [keywordsPredicateAtomID, tagAtomID] = await prepareTag(
    tag,
    requestHash,
  )
  const triples = atomIDs.map((atomID) => ({
    subjectId: atomID,
    predicateId: keywordsPredicateAtomID,
    objectId: tagAtomID,
  }))
  return triples
}

// Optimized Functions:

// This function takes an array and a size, and splits the array into chunks of the given size
export function chunk<T>(array: T[], size: number): T[][] {
  const chunked: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size))
  }
  return chunked
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface AtomExistsResult {
  filteredObj: any
  cid: string
  originalIndex: number
  alreadyExists?: boolean
  atomId?: string
}

export interface PinDataResult {
  filteredObj: any
  cid: string
  originalIndex: number
  alreadyExists?: boolean
}

export interface Triple {
  subjectId: string
  predicateId: string
  objectId: string
  alreadyExists?: boolean
  tripleId?: string
}

export interface AtomURIResult {
  atomId: string
  uri: string
  originalIndex: number
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error)
      if (attempt === maxRetries) {
        throw error
      }
    }
  }
  throw new Error('This should never be reached')
}

export async function pinAllData(
  atoms: any[],
  concurrencyLimit: number,
  maxRetries: number = 3,
  delayBetweenBatches: number = 1000,
  requestHash?: string,
): Promise<PinDataResult[]> {
  requestHash
    ? await pushUpdate(requestHash, 'Splitting atoms by unique image...')
    : null
  const { uniqueAtoms, duplicateAtoms } = splitAtomsByUniqueImage(atoms)

  // Process unique atoms first
  requestHash
    ? await pushUpdate(requestHash, 'Pinning atom data with unique images...')
    : null
  const pinnedData: PinDataResult[] = await processAtomDataBatches(
    uniqueAtoms,
    concurrencyLimit,
    maxRetries,
    delayBetweenBatches,
    // requestHash, // TODO: eventually add support for requestHash to the function signature
  )

  // Process duplicate atoms after unique atoms
  requestHash
    ? await pushUpdate(
        requestHash,
        'Pinning atom data with duplicate images...',
      )
    : null
  const duplicatePinnedData = await processAtomDataBatches(
    duplicateAtoms,
    concurrencyLimit,
    maxRetries,
    delayBetweenBatches,
    uniqueAtoms.length,
    // requestHash, // TODO: eventually add support for requestHash to the function signature
  )

  // Combine results and return in original order
  requestHash
    ? await pushUpdate(requestHash, 'Combining and sorting pinned data...')
    : null
  pinnedData.push(...duplicatePinnedData)
  pinnedData.sort((a, b) => a.originalIndex - b.originalIndex)

  return pinnedData
}

// Splits atoms into two arrays: unique and duplicate based on the 'image' field
export function splitAtomsByUniqueImage(atoms: any[]): {
  uniqueAtoms: any[]
  duplicateAtoms: any[]
} {
  const seenImages = new Set<string>()
  const uniqueAtoms: any[] = []
  const duplicateAtoms: any[] = []

  for (const atom of atoms) {
    const image = atom.image
    if (image && seenImages.has(image)) {
      duplicateAtoms.push(atom)
    } else {
      if (image) {
        seenImages.add(image)
      }
      uniqueAtoms.push(atom)
    }
  }

  return { uniqueAtoms, duplicateAtoms }
}

// Processes atoms in batches, returning resolved PinDataResult objects
export async function processAtomDataBatches(
  atoms: any[],
  concurrencyLimit: number,
  maxRetries: number,
  delayBetweenBatches: number,
  startIndex: number = 0,
): Promise<PinDataResult[]> {
  const pinDataBatches = chunk(
    atoms.map((atom, index) => ({ atom, index: index + startIndex })),
    concurrencyLimit,
  )
  const pinnedData: PinDataResult[] = []

  for (const batch of pinDataBatches) {
    const batchResults = await Promise.all(
      batch.map(async ({ atom, index }, i) => {
        await delay(i * 200) // Delay between individual calls within the batch
        const result = await retryOperation(async () => {
          const [filteredObj, cid] = await pinAtomData(atom)
          return {
            filteredObj,
            cid: `ipfs://${cid}`,
            originalIndex: index,
          } as PinDataResult
        }, maxRetries)
        return result
      }),
    )
    pinnedData.push(...batchResults)
    await delay(delayBetweenBatches) // Delay between batches
  }

  return pinnedData
}

// Helper function for front end / interfaces
export async function processCheckAtomsExist(
  atoms: any[],
  concurrencyLimit: number,
  maxRetries: number,
  delayBetweenBatches: number,
  startIndex: number = 0,
): Promise<AtomExistsResult[]> {
  const atomBatches = chunk(
    atoms.map((atom, index) => ({ atom, index: index + startIndex })),
    concurrencyLimit,
  )
  const atomExistsResults: AtomExistsResult[] = []

  for (const batch of atomBatches) {
    const batchResults = await Promise.all(
      batch.map(async ({ atom, index }) => {
        // This may not be needed anymore, especially with the db caching
        // await delay(i * 100); // Delay between individual calls within the batch
        const result = await retryOperation(async () => {
          const alreadyUploadedImage = await checkImageAlreadyUploaded(
            atom.image,
          )
          if (alreadyUploadedImage) {
            atom.image = alreadyUploadedImage
          }
          const cid = await precomputeCID(atom)
          const atomID = await getAtomID(`ipfs://${cid}`)
          const exists = atomID !== '0'
          return {
            filteredObj: atom,
            cid: `ipfs://${cid}`,
            originalIndex: index,
            atomId: atomID,
            alreadyExists: exists,
          } as AtomExistsResult
        }, maxRetries)
        return result
      }),
    )
    atomExistsResults.push(...batchResults)
    await delay(delayBetweenBatches) // Delay between batches
  }

  // Sort the results to maintain the original order
  atomExistsResults.sort((a, b) => a.originalIndex - b.originalIndex)

  return atomExistsResults
}

export async function cullExistingAtoms(
  pinnedData: PinDataResult[],
  concurrencyLimit: number,
  maxRetries: number = 3,
  requestHash?: string,
): Promise<[PinDataResult[], PinDataResult[]]> {
  const filteredData: PinDataResult[] = []
  const alreadyExistsData: PinDataResult[] = []
  const pinnedDataBatches = chunk(pinnedData, concurrencyLimit)

  for (const batch of pinnedDataBatches) {
    const batchResults = await Promise.all(
      batch.map(async ({ filteredObj, cid, originalIndex }) =>
        retryOperation(async () => {
          const alreadyExists = await checkAtomExists(cid)
          if (alreadyExists) {
            await pushUpdate(
              requestHash,
              `${truncateString(cid, 20)} already exists`,
            )
          }
          return { filteredObj, cid, originalIndex, alreadyExists }
        }, maxRetries),
      ),
    )
    filteredData.push(
      ...batchResults.filter((result) => result.alreadyExists === false),
    )
    alreadyExistsData.push(
      ...batchResults.filter((result) => result.alreadyExists === true),
    )
  }

  // Sort the results to maintain the original order
  filteredData.sort((a, b) => a.originalIndex - b.originalIndex)
  alreadyExistsData.sort((a, b) => a.originalIndex - b.originalIndex)

  return [filteredData, alreadyExistsData]
}

export async function cullExistingTriples(
  triples: Triple[],
  concurrencyLimit: number,
  maxRetries: number = 3,
  delayBetweenBatches: number = 1000,
): Promise<[Triple[], Triple[]]> {
  const filteredTriples: Triple[] = []
  const alreadyExistsTriples: Triple[] = []
  const tripleBatches = chunk(triples, concurrencyLimit)

  for (const batch of tripleBatches) {
    const batchResults = await Promise.all(
      batch.map(async ({ subjectId, predicateId, objectId }, i) => {
        await delay(i * 100) // Slight delay between concurrent requests
        return retryOperation(async () => {
          const tripleId = await getTripleID(subjectId, predicateId, objectId)
          return {
            subjectId,
            predicateId,
            objectId,
            tripleId,
            alreadyExists: tripleId !== '0',
          }
        }, maxRetries)
      }),
    )

    filteredTriples.push(
      ...batchResults.filter((result) => result.alreadyExists === false),
    )
    alreadyExistsTriples.push(
      ...batchResults.filter((result) => result.alreadyExists === true),
    )

    await delay(delayBetweenBatches) // Delay between batches to throttle requests
  }

  return [filteredTriples, alreadyExistsTriples]
}

// TODO: Refactor cullExistingTriples to just use this?
export async function getTripleIdsFromTripleData(
  triples: Triple[],
  concurrencyLimit: number,
  maxRetries: number = 3,
  delayBetweenBatches: number = 1000,
): Promise<Triple[]> {
  const tripleBatches = chunk(triples, concurrencyLimit)
  const triplesWithIds: Triple[] = []

  for (const batch of tripleBatches) {
    const batchResults = await Promise.all(
      batch.map(async ({ subjectId, predicateId, objectId }, i) => {
        await delay(i * 100) // Slight delay between concurrent requests
        return retryOperation(async () => {
          const tripleId = await getTripleID(subjectId, predicateId, objectId)
          const alreadyExists = tripleId !== '0'
          return {
            subjectId,
            predicateId,
            objectId,
            alreadyExists,
            tripleId,
          } as Triple
        }, maxRetries)
      }),
    )

    triplesWithIds.push(...batchResults)
    await delay(delayBetweenBatches) // Delay between batches to throttle requests
  }

  return triplesWithIds
}

// Reading from EVM concurrently needs a delay between requests
export async function getAtomIdsFromURI(
  URIs: string[],
  concurrencyLimit: number,
  maxRetries: number = 3,
  delayBetweenBatches: number = 1000,
): Promise<AtomURIResult[]> {
  const atomIdBatches = chunk(
    URIs.map((uri, index) => ({ uri, index })),
    concurrencyLimit,
  )
  const atoms: AtomURIResult[] = []

  for (const batch of atomIdBatches) {
    const batchResults = await Promise.all(
      batch.map(async ({ uri, index }, i) => {
        await delay(i * 100) // Introduce a slight delay between each concurrent request
        const result = await retryOperation(async () => {
          const atomId = await getAtomID(uri)
          return { atomId, uri, originalIndex: index } as AtomURIResult
        }, maxRetries)
        return result
      }),
    )
    atoms.push(...batchResults)
    await delay(delayBetweenBatches) // Delay between batches to throttle requests
  }

  // Sort the results to maintain the original order
  atoms.sort((a, b) => a.originalIndex - b.originalIndex)

  return atoms
}

// Always perform these chunks sequentially
export async function processBatchAtoms(
  cids: string[],
  requestHash?: string,
): Promise<string[]> {
  const result: string[] = []
  console.log('Processing batch atoms with CIDs: ', cids)
  requestHash
    ? await pushUpdate(requestHash, `Processing batch atoms with CIDs: ${cids}`)
    : null
  if (cids.length === 0) {
    requestHash ? await pushUpdate(requestHash, 'No new atoms to create') : null
    console.log('No new atoms to create')
    return result
  }

  // Attempt static execution in iteratively smaller chunks until it either succeeds or we have reason to believe the revert is not due to out of gas
  console.log('Predetermining number of chunks to process batch atoms...')
  requestHash
    ? await pushUpdate(
        requestHash,
        'Predetermining number of chunks to process batch atoms...',
      )
    : null
  let numChunks = 1

  if (cids.length > 1) {
    let staticExecutionReverted = true
    let latestBatch: string[] = [] // for debugging
    while (staticExecutionReverted && numChunks < cids.length) {
      try {
        const chunkSize = Math.ceil(cids.length / numChunks)
        const chunks = chunk(cids, chunkSize)
        for (const batch of chunks) {
          latestBatch = batch // for debugging
          const request = batchCreateAtomRequest(batch)
          const gasEstimate = await estimateGas(request)
          if (gasEstimate > 30000000) {
            throw new Error(
              'Gas estimate for batch atoms will likely exceed block gas limit',
            )
          }
        }
        staticExecutionReverted = false
      } catch (error) {
        console.log(
          'Batch failed gas estimation, chunking further: ',
          latestBatch,
        )
        requestHash
          ? await pushUpdate(requestHash, `Reducing chunks: ${latestBatch}`)
          : null
        numChunks++
      }
    }

    if (staticExecutionReverted) {
      requestHash
        ? await pushUpdate(
            requestHash,
            'static execution reverted with chunk size of 1',
          )
        : null
      throw new Error('static execution reverted with chunk size of 1')
    }
  }

  const chunkSize = Math.ceil(cids.length / numChunks)

  // Then do it
  let lastChunkForDebug: string[] = []
  try {
    const chunks = chunk(cids, chunkSize)
    console.log('Number of batch atom chunks: ', numChunks)
    requestHash
      ? await pushUpdate(
          requestHash,
          `Number of batch atom chunks: ${numChunks}`,
        )
      : null
    console.log(
      'Chunk lengths: ',
      chunks.map((chunk) => chunk.length),
    )
    requestHash
      ? await pushUpdate(
          requestHash,
          `Chunk lengths: ${chunks.map((chunk) => chunk.length)}`,
        )
      : null
    for (const batch of chunks) {
      lastChunkForDebug = batch
      const txID = await batchCreateAtoms(batch)
      result.push(txID)
      console.log('Batch transaction ID: ', txID)
      requestHash
        ? await pushUpdate(requestHash, `Batch transaction ID: ${txID}`)
        : null
    }
    return result
  } catch (error) {
    console.error('Error processing batch atoms:', lastChunkForDebug)
    requestHash
      ? await pushUpdate(requestHash, `Error processing batch atoms: ${error}`)
      : null
    return result
  }
}

// TODO: Refactor this to be abstract to avoid duplicating code in processBatchAtoms
export async function processBatchTriples(
  triples: Triple[],
  requestHash?: string,
): Promise<string[]> {
  const result: string[] = []
  if (triples.length === 0) {
    requestHash
      ? await pushUpdate(requestHash, 'No new triples to create')
      : null
    console.log('No new triples to create')
    return result
  }

  // Attempt static execution in iteratively smaller chunks until it either succeeds or we have reason to believe the revert is not due to out of gas
  let numChunks = 1

  if (triples.length > 1) {
    let staticExecutionReverted = true
    let latestBatch: Triple[] = [] // for debugging
    console.log('Predetermining number of chunks to process batch triples...')
    requestHash
      ? await pushUpdate(
          requestHash,
          'Predetermining number of chunks to process batch triples...',
        )
      : null
    while (staticExecutionReverted && numChunks < triples.length) {
      try {
        const chunkSize = Math.ceil(triples.length / numChunks)
        const chunks = chunk(triples, chunkSize)
        for (const batch of chunks) {
          latestBatch = batch // for debugging
          const request = batchCreateTripleRequest(
            batch.map((triple) => triple.subjectId),
            batch.map((triple) => triple.predicateId),
            batch.map((triple) => triple.objectId),
          )
          const gasEstimate = await estimateGas(request)
          if (gasEstimate > 30000000) {
            throw new Error(
              'Gas estimate for batch triples will likely exceed block gas limit',
            )
          }
        }
        staticExecutionReverted = false
      } catch (error) {
        console.log(
          'Batch failed gas estimation, chunking further: ',
          latestBatch,
        )
        requestHash
          ? await pushUpdate(requestHash, `Reducing chunks: ${latestBatch}`)
          : null
        numChunks++
      }
    }

    if (staticExecutionReverted) {
      requestHash
        ? await pushUpdate(
            requestHash,
            'static execution reverted with chunk size of 1',
          )
        : null
      throw new Error('static execution reverted with chunk size of 1')
    }
  }

  const chunkSize = Math.ceil(triples.length / numChunks)

  // Then do it
  let lastChunkForDebug: Triple[] = []
  try {
    const chunks = chunk(triples, chunkSize)
    console.log('Number of batch triple chunks: ', numChunks)
    requestHash
      ? await pushUpdate(
          requestHash,
          `Number of batch triple chunks: ${numChunks}`,
        )
      : null
    console.log(
      'Chunk lengths: ',
      chunks.map((chunk) => chunk.length),
    )
    requestHash
      ? await pushUpdate(
          requestHash,
          `Chunk lengths: ${chunks.map((chunk) => chunk.length)}`,
        )
      : null
    for (const batch of chunks) {
      lastChunkForDebug = batch
      const txID = await batchCreateTriples(
        batch.map((triple) => triple.subjectId),
        batch.map((triple) => triple.predicateId),
        batch.map((triple) => triple.objectId),
      )
      result.push(txID)
      console.log('Batch transaction ID: ', txID)
      requestHash
        ? await pushUpdate(requestHash, `Batch transaction ID: ${txID}`)
        : null
    }
    return result
  } catch (error) {
    console.error('Error processing batch triples...', lastChunkForDebug)
    requestHash
      ? await pushUpdate(
          requestHash,
          `Error processing batch triples: ${error}`,
        )
      : null
    return result
  }
}

// In lieu of URI resolver
export async function getAtomDataFromID(atomID: string): Promise<any> {
  try {
    const atomURI = await getAtomURI(atomID)
    const atomData = await getURIData(atomURI)
    // Kind of a hack, but if it's not an IPFS CID, just return the URI
    if (
      typeof atomData === 'string' &&
      atomData === 'Invalid URL - ERR_ID:00004'
    ) {
      return { name: atomURI }
    }
    return atomData
  } catch (error) {
    console.error('Error getting atom data from ID:', atomID)
  }
  return null
}
