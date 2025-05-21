import * as React from 'react'

import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemContainer,
  RadioGroupItemLabel,
  Separator,
} from '@0xintuition/1ui'

import { Form, useSearchParams } from '@remix-run/react'

import { ExploreAddTags } from './ExploreAddTags/ExploreAddTags'
import { ExploreSearchInput } from './ExploreSearchInput/ExploreSearchInput'

export interface ExploreSearchFormProps {
  searchParam: string
  inputPlaceholder?: string
}

const ExploreSearchForm = ({
  searchParam,
  inputPlaceholder = 'Search',
}: ExploreSearchFormProps) => {
  const tagsInputId = 'tagIds'
  const [searchParams, setSearchParams] = useSearchParams()

  const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    const tagIdQuery = formData.get(tagsInputId) as string
    const displayNameQuery = formData.get(searchParam) as string
    const isUser = formData.get('isUser') as string

    const currentParams = Object.fromEntries(searchParams)
    const updatedParams = {
      ...currentParams,
      [searchParam]: displayNameQuery || '',
      tagIds: tagIdQuery || '',
      isUser: isUser || '',
      page: '1',
    }

    setSearchParams(updatedParams)
  }

  const radioGroupData = [
    {
      id: 'all',
      value: '',
      displayValue: 'All',
    },
    {
      id: 'users',
      value: 'true',
      displayValue: 'Users',
    },
    {
      id: 'non-users',
      value: 'false',
      displayValue: 'Non-users',
    },
  ]

  const currentIsUser = searchParams.get('isUser') || ''

  return (
    <Form
      method="get"
      onChange={handleChange}
      className="flex flex-col rounded-lg p-5 border border-1 theme-border bg-card/70 gap-2 max-md:w-full"
    >
      <ExploreSearchInput
        searchParam={searchParam}
        placeholder={inputPlaceholder}
        initialValue={searchParams.get(searchParam)}
      />
      {searchParam === 'identity' && (
        <>
          <Separator className="my-2 in-out-gradient-strong max-md:m-0" />
          <ExploreAddTags inputId={tagsInputId} />
          <Separator className="my-2 in-out-gradient-strong max-md:m-0" />
          <RadioGroup
            name="isUser"
            defaultValue={currentIsUser}
            variant="simple"
          >
            {radioGroupData.map((item, index) => (
              <div key={index}>
                <RadioGroupItemContainer variant="simple">
                  <RadioGroupItem
                    value={item.value}
                    id={item.id}
                    size="small"
                  />
                  <RadioGroupItemLabel
                    htmlFor={item.id}
                    value={item.displayValue}
                  />
                </RadioGroupItemContainer>
              </div>
            ))}
          </RadioGroup>
        </>
      )}
    </Form>
  )
}

export { ExploreSearchForm }
