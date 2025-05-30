import { Resvg } from '@resvg/resvg-js'
import type { SatoriOptions } from 'satori'
import satori from 'satori'

const fontGeistMedium = async (baseUrl: string) => {
  try {
    // Try to load font from the same origin as the request
    const fontUrl = `${baseUrl}/fonts/Geist-Medium.otf`
    const res = await fetch(fontUrl, {
      headers: {
        'ngrok-skip-browser-warning': '1',
      },
    })
    if (!res.ok) {
      throw new Error(`Failed to load font from ${fontUrl}`)
    }
    return res.arrayBuffer()
  } catch (error) {
    console.error('Error loading font:', error)
    // Fallback to absolute URL if relative fails
    const fallbackUrl = 'https://intuition.systems/fonts/Geist-Medium.otf'
    const res = await fetch(fallbackUrl, {
      headers: {
        'ngrok-skip-browser-warning': '1',
      },
    })
    if (!res.ok) {
      throw new Error(`Failed to load font from fallback ${fallbackUrl}`)
    }
    return res.arrayBuffer()
  }
}

export async function createOGImage(
  title: string,
  type: 'list' | 'identity' | 'claim' | 'question' | 'epoch' | 'epochs',
  requestUrl: string,
  holders?: string,
  tvl?: string,
  holdersFor?: number | string,
  holdersAgainst?: number | string,
  tvlFor?: number | string,
  tvlAgainst?: number | string,
  itemCount?: string,
) {
  const fontData = await fontGeistMedium(requestUrl)

  const options: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Geist',
        data: fontData,
        style: 'normal',
      },
    ],
  }

  const svg = await satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'black',
        color: 'white',
        fontFamily: 'Geist',
        backgroundImage: `url('https://res.cloudinary.com/dfpwy9nyv/image/upload/v1726282731/Portal%20Assets/media-links/banner-variant-1.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5722 19.5675C17.5786 19.5756 17.5903 19.5769 17.5983 19.5704C18.8904 18.5138 19.9266 17.1695 20.6267 15.6412C21.3295 14.1072 21.6748 12.4292 21.6358 10.7377C21.5967 9.04617 21.1744 7.38675 20.4017 5.88853C19.6319 4.3959 18.5349 3.10333 17.1955 2.11057C17.1872 2.1044 17.1755 2.10627 17.1695 2.11474L16.8097 2.61813C16.8037 2.62659 16.8055 2.63844 16.8138 2.6446C18.0724 3.57771 19.1033 4.79249 19.8268 6.19521C20.5531 7.60356 20.9501 9.16338 20.9868 10.7534C21.0235 12.3434 20.6989 13.9208 20.0383 15.3627C19.3803 16.799 18.4066 18.0624 17.1925 19.0555C17.1845 19.062 17.1832 19.0739 17.1896 19.0821L17.5722 19.5675Z"
              fill="#E5E5E5"
            />
            <path
              d="M16.3132 1.54326C16.3185 1.53425 16.3155 1.52263 16.3067 1.51733C14.9727 0.719854 13.4859 0.222649 11.9465 0.0593706C10.4009 -0.104564 8.83853 0.0719634 7.3658 0.576939C5.89304 1.08191 4.54446 1.90349 3.4118 2.98574C2.28368 4.06368 1.39612 5.37502 0.809011 6.83119C0.805108 6.84087 0.809684 6.85193 0.819213 6.85589L1.38576 7.09064C1.39531 7.0946 1.40616 7.08994 1.41008 7.08026C1.96195 5.71189 2.79611 4.47959 3.85626 3.4666C4.92097 2.44928 6.18866 1.677 7.57302 1.20232C8.9574 0.727645 10.426 0.561709 11.8789 0.715806C13.3256 0.869248 14.7228 1.33642 15.9765 2.08572C15.9853 2.09102 15.9968 2.08803 16.002 2.07903L16.3132 1.54326Z"
              fill="#E5E5E5"
            />
            <path
              d="M0.380453 8.1857C0.370508 8.183 0.360306 8.18905 0.357683 8.19914C0.113567 9.14035 -0.00661751 10.1103 0.000280913 11.0836C0.000355927 11.094 0.00877764 11.1024 0.019069 11.1023L0.630942 11.0965C0.641231 11.0964 0.649488 11.0879 0.649416 11.0774C0.643034 10.1633 0.755913 9.25235 0.985096 8.3683C0.987719 8.35818 0.981796 8.34783 0.971848 8.34513L0.380453 8.1857Z"
              fill="#E5E5E5"
            />
            <path
              d="M0.114765 12.465C0.104572 12.4664 0.0974195 12.4759 0.0988044 12.4863C0.295541 13.9574 0.783179 15.3727 1.53241 16.6469C2.2848 17.9266 3.28535 19.0372 4.47317 19.9114C5.66099 20.7856 7.01133 21.4051 8.44214 21.7321C9.86689 22.0578 11.3418 22.0868 12.778 21.8175C12.7881 21.8156 12.7948 21.8057 12.7929 21.7955L12.6811 21.1838C12.6792 21.1736 12.6695 21.1668 12.6594 21.1687C11.3097 21.4216 9.92367 21.3943 8.58478 21.0882C7.23984 20.7808 5.97051 20.1985 4.85395 19.3767C3.7374 18.555 2.79689 17.511 2.08962 16.3081C1.38556 15.1107 0.927232 13.7807 0.742198 12.3983C0.74081 12.3879 0.731431 12.3806 0.721229 12.382L0.114765 12.465Z"
              fill="#E5E5E5"
            />
            <path
              d="M13.8642 21.5346C13.8671 21.5446 13.8775 21.5504 13.8873 21.5474C14.8318 21.2631 15.7337 20.849 16.568 20.3167C16.5767 20.3111 16.5793 20.2994 16.5738 20.2906L16.2478 19.7642C16.2423 19.7554 16.2308 19.7527 16.2221 19.7583C15.4384 20.2582 14.5913 20.6471 13.7043 20.9143C13.6944 20.9172 13.6888 20.9278 13.6917 20.9378L13.8642 21.5346Z"
              fill="#E5E5E5"
            />
            <path
              d="M18.59 16.4748C15.614 20.8362 9.72285 21.9198 5.4317 18.8952C1.14051 15.8706 0.0742711 9.88307 3.0502 5.52168C6.02613 1.16028 11.9173 0.0766147 16.2085 3.10124C20.4997 6.12585 21.5659 12.1134 18.59 16.4748ZM4.45749 6.51361C2.02057 10.0851 2.89368 14.9881 6.40763 17.4649C9.92158 19.9417 14.7457 19.0543 17.1827 15.4829C19.6196 11.9114 18.7465 7.00835 15.2325 4.53156C11.7186 2.05475 6.89442 2.94214 4.45749 6.51361Z"
              fill="#E5E5E5"
            />
          </svg>
          <svg
            width="101"
            height="14"
            viewBox="0 0 101 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.638672 0.718803H2.31411V13.2815H0.638672V0.718803ZM7.24154 0.718803H9.44055L16.247 11.0457H16.2819V0.718803H17.9574V13.2815H15.8282L8.95188 2.95453H8.91697V13.2815H7.24154V0.718803ZM25.46 2.31575H21.4808V0.718803H31.1146V2.31575H27.1354V13.2815H25.46V2.31575ZM36.0925 0.718803V8.41965C36.0925 8.81001 36.1448 9.21812 36.2495 9.64397C36.3542 10.058 36.5288 10.4424 36.7731 10.7973C37.0174 11.1522 37.3374 11.442 37.733 11.6668C38.1286 11.8915 38.6172 12.0039 39.199 12.0039C39.7807 12.0039 40.2694 11.8915 40.665 11.6668C41.0606 11.442 41.3806 11.1522 41.6249 10.7973C41.8692 10.4424 42.0438 10.058 42.1485 9.64397C42.2532 9.21812 42.3055 8.81001 42.3055 8.41965V0.718803H43.981V8.6858C43.981 9.41922 43.8588 10.0876 43.6145 10.6909C43.3701 11.2823 43.0327 11.7969 42.6022 12.2346C42.1717 12.6723 41.6656 13.0094 41.0839 13.246C40.5021 13.4826 39.8738 13.6009 39.199 13.6009C38.5242 13.6009 37.8959 13.4826 37.3141 13.246C36.7324 13.0094 36.2263 12.6723 35.7958 12.2346C35.3653 11.7969 35.0278 11.2823 34.7835 10.6909C34.5392 10.0876 34.417 9.41922 34.417 8.6858V0.718803H36.0925ZM48.6772 0.718803H50.3526V13.2815H48.6772V0.718803ZM57.863 2.31575H53.8838V0.718803H63.5176V2.31575H59.5384V13.2815H57.863V2.31575ZM67.0469 0.718803H68.7223V13.2815H67.0469V0.718803ZM79.3213 13.6009C78.3789 13.6009 77.5121 13.4352 76.7209 13.104C75.9297 12.761 75.2491 12.2937 74.679 11.7023C74.1205 11.1108 73.6784 10.4129 73.3526 9.60849C73.0384 8.8041 72.8814 7.93465 72.8814 7.00014C72.8814 6.06563 73.0384 5.19618 73.3526 4.39179C73.6784 3.5874 74.1205 2.88947 74.679 2.29801C75.2491 1.70655 75.9297 1.24521 76.7209 0.913987C77.5121 0.570939 78.3789 0.399414 79.3213 0.399414C80.2638 0.399414 81.1306 0.570939 81.9217 0.913987C82.7129 1.24521 83.3878 1.70655 83.9462 2.29801C84.5164 2.88947 84.9585 3.5874 85.2726 4.39179C85.5984 5.19618 85.7613 6.06563 85.7613 7.00014C85.7613 7.93465 85.5984 8.8041 85.2726 9.60849C84.9585 10.4129 84.5164 11.1108 83.9462 11.7023C83.3878 12.2937 82.7129 12.761 81.9217 13.104C81.1306 13.4352 80.2638 13.6009 79.3213 13.6009ZM79.3213 12.0039C80.0311 12.0039 80.671 11.8738 81.2411 11.6135C81.8112 11.3415 82.2999 10.9807 82.7071 10.5312C83.1143 10.0817 83.4285 9.55525 83.6496 8.95196C83.8706 8.33684 83.9811 7.68623 83.9811 7.00014C83.9811 6.31404 83.8706 5.66935 83.6496 5.06605C83.4285 4.45093 83.1143 3.91862 82.7071 3.4691C82.2999 3.01959 81.8112 2.66471 81.2411 2.40447C80.671 2.1324 80.0311 1.99636 79.3213 1.99636C78.6116 1.99636 77.9717 2.1324 77.4016 2.40447C76.8314 2.66471 76.3428 3.01959 75.9355 3.4691C75.5283 3.91862 75.2142 4.45093 74.9931 5.06605C74.772 5.66935 74.6615 6.31404 74.6615 7.00014C74.6615 7.68623 74.772 8.33684 74.9931 8.95196C75.2142 9.55525 75.5283 10.0817 75.9355 10.5312C76.3428 10.9807 76.8314 11.3415 77.4016 11.6135C77.9717 11.8738 78.6116 12.0039 79.3213 12.0039ZM89.9155 0.718803H92.1145L98.921 11.0457H98.9559V0.718803H100.631V13.2815H98.5021L91.6258 2.95453H91.5909V13.2815H89.9155V0.718803Z"
              fill="#E5E5E5"
            />
          </svg>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {type === 'list' && (
              <path
                d="M5 21V5C5 4.45 5.19583 3.97917 5.5875 3.5875C5.97917 3.19583 6.45 3 7 3H17C17.55 3 18.0208 3.19583 18.4125 3.5875C18.8042 3.97917 19 4.45 19 5V21L12 18L5 21ZM7 17.95L12 15.8L17 17.95V5H7V17.95Z"
                fill="white"
              />
            )}
            {type === 'identity' && (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0084 3.5C10.8296 3.5 9.71635 3.7713 8.72569 4.25417L8.06848 2.90581C9.25938 2.32534 10.597 2 12.0084 2C16.9805 2 21.0112 6.03071 21.0112 11.0028C21.0112 13.1838 20.8105 15.3185 20.4262 17.3894L20.2894 18.1268L18.8146 17.8532L18.9514 17.1158C19.319 15.1347 19.5112 13.0916 19.5112 11.0028C19.5112 6.85913 16.1521 3.5 12.0084 3.5ZM6.55983 5.84473C5.28583 7.18997 4.50555 9.00447 4.50555 11.0028C4.50555 12.4932 4.32711 13.943 3.99006 15.3314L3.81314 16.0603L2.35547 15.7064L2.53239 14.9776C2.84153 13.7041 3.00555 12.3731 3.00555 11.0028C3.00555 8.6057 3.94342 6.42601 5.47073 4.81329L6.55983 5.84473ZM12.0084 7.62642C10.1436 7.62642 8.63197 9.13809 8.63197 11.0028C8.63197 12.9227 8.39042 14.7872 7.93567 16.5672L6.48235 16.1959C6.90636 14.5363 7.13197 12.7964 7.13197 11.0028C7.13197 8.30966 9.31522 6.12642 12.0084 6.12642C14.7016 6.12642 16.8848 8.30966 16.8848 11.0028C16.8848 12.0735 16.8299 13.1315 16.7227 14.1743L15.2306 14.021C15.3325 13.029 15.3848 12.0222 15.3848 11.0028C15.3848 9.13809 13.8731 7.62642 12.0084 7.62642ZM12.7588 10.2528V11.0028C12.7588 13.932 12.284 16.7517 11.4066 19.3885C11.1809 20.0669 10.9285 20.7331 10.6507 21.3859L10.3571 22.076L8.97684 21.4887L9.27049 20.7986C9.53245 20.1829 9.77046 19.5546 9.98335 18.9149C10.8106 16.4289 11.2588 13.769 11.2588 11.0028V10.2528H12.7588ZM14.427 18.4449C14.6352 17.6534 14.811 16.8488 14.9529 16.0324L16.4307 16.2893C16.2815 17.1478 16.0966 17.9941 15.8776 18.8265C15.6612 19.6492 15.4114 20.4583 15.1299 21.2524L14.8793 21.9593L13.4655 21.4581L13.7161 20.7512C13.9838 19.9962 14.2212 19.227 14.427 18.4449ZM5.5414 19.0176C5.72453 18.5766 5.893 18.128 6.04619 17.6724L7.46797 18.1504C7.3037 18.639 7.12306 19.12 6.9267 19.5929L6.63907 20.2855L5.25377 19.7103L5.5414 19.0176Z"
                fill="white"
              />
            )}
            {type === 'claim' && (
              <path
                d="M15.25 9.75H8.75M12.25 14.25H8.75M2.75 20.25H16.25C19.0114 20.25 21.25 18.0114 21.25 15.25V8.75C21.25 5.98858 19.0114 3.75 16.25 3.75H7.75C4.98858 3.75 2.75 5.98858 2.75 8.75V20.25Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
          <div style={{ fontSize: '18px' }}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%%',
          position: 'relative',
        }}
      >
        <h1
          style={{
            fontSize: '96px',
            fontWeight: 'regular',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          {title}
        </h1>
        <svg
          width="500"
          height="1"
          viewBox="0 0 500 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="500"
            height="1"
            rx="0.5"
            fill="url(#paint0_radial_762_4729)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_762_4729"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(250 0.5) rotate(90) scale(0.5 250)"
            >
              <stop stopColor="white" stopOpacity="0.7" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            fontSize: '24px',
            marginTop: '24px',
          }}
        >
          {type === 'claim' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>For</span>
                <span style={{ fontWeight: 'bold' }}>{tvlFor || '0'} ETH</span>
                <span style={{ opacity: 0.7 }}>
                  {holdersFor !== undefined ? holdersFor : '0'} holders
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>Against</span>
                <span style={{ fontWeight: 'bold' }}>
                  {tvlAgainst || '0'} ETH
                </span>
                <span style={{ opacity: 0.7 }}>
                  {holdersAgainst !== undefined ? holdersAgainst : '0'} holders
                </span>
              </div>
            </div>
          )}
          {type === 'identity' && (
            <div
              style={{
                display: 'flex',
                gap: '20px',
                fontSize: '24px',
                marginTop: '24px',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{tvl || '0'} ETH</span>
              <span style={{ opacity: 0.7 }}>
                {holders !== undefined ? holders : '0'} holders
              </span>
            </div>
          )}
          {type === 'list' && (
            <div
              style={{
                display: 'flex',
                gap: '20px',
                fontSize: '24px',
                marginTop: '24px',
              }}
            >
              <span style={{ opacity: 0.7 }}>
                {itemCount !== undefined ? itemCount : '0'} entries
              </span>
              <span style={{ fontWeight: 'bold' }}>
                {holders !== undefined ? holders : '0'} signals
              </span>
            </div>
          )}
          {type === 'epoch' && (
            <div
              style={{
                display: 'flex',
                gap: '20px',
                fontSize: '24px',
                marginTop: '24px',
              }}
            >
              <span style={{ opacity: 0.7 }}>
                {itemCount !== undefined ? itemCount : '0'} total points
              </span>
              <span style={{ fontWeight: 'bold' }}>
                {holders !== undefined ? holders : '0'} questions
              </span>
            </div>
          )}
          {type === 'epochs' && (
            <div
              style={{
                display: 'flex',
                gap: '20px',
                fontSize: '24px',
                marginTop: '24px',
              }}
            >
              <span style={{ opacity: 0.7 }}>
                {itemCount !== undefined ? itemCount : '0'} total points
              </span>
              <span style={{ fontWeight: 'bold' }}>
                {holders !== undefined ? holders : '0'} epochs
              </span>
            </div>
          )}
        </div>
      </div>
    </div>,
    options,
  )

  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  return pngData.asPng()
}
