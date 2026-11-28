type Servicio = 'sitio' | 'trato' | 'proceso';

export default function IlustracionServicio({servicio}: {servicio: Servicio}) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="mx-auto w-full max-w-lg text-brand-sky-text"
    >
      <circle cx="240" cy="180" r="150" className="fill-brand-sky/10" />
      <circle cx="390" cy="70" r="20" className="fill-brand-coral/20" />
      <circle cx="75" cy="285" r="12" className="fill-brand-sky/20" />
      {servicio === 'sitio' && (
        <>
          <rect
            x="65"
            y="65"
            width="350"
            height="230"
            rx="20"
            className="fill-white"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path d="M65 105h350" stroke="currentColor" strokeWidth="3" />
          <circle cx="88" cy="85" r="5" className="fill-brand-coral" />
          <circle cx="106" cy="85" r="5" className="fill-brand-sky" />
          <circle cx="124" cy="85" r="5" className="fill-brand-ink/20" />
          <rect x="95" y="132" width="120" height="12" rx="6" className="fill-brand-ink" />
          <rect x="95" y="158" width="145" height="8" rx="4" className="fill-brand-ink/20" />
          <rect x="95" y="176" width="120" height="8" rx="4" className="fill-brand-ink/20" />
          <rect x="95" y="212" width="105" height="34" rx="10" className="fill-brand-coral" />
          <rect x="273" y="132" width="110" height="114" rx="14" className="fill-brand-sky/15" />
          <path d="m291 216 26-34 20 20 17-23 15 37Z" className="fill-brand-sky" />
          <circle cx="350" cy="157" r="10" className="fill-brand-coral" />
          <path
            d="M187 319h106M240 295v24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {servicio === 'trato' && (
        <>
          <path
            d="M88 90a20 20 0 0 1 20-20h174a20 20 0 0 1 20 20v92a20 20 0 0 1-20 20H145l-40 28v-28a20 20 0 0 1-17-20Z"
            className="fill-white"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M133 115h119M133 140h90M133 165h105"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M210 202a20 20 0 0 1 20-20h138a20 20 0 0 1 20 20v67a20 20 0 0 1-20 20v27l-38-27H230a20 20 0 0 1-20-20Z"
            className="fill-brand-ink"
          />
          <path
            d="m267 237 19 19 39-39"
            className="stroke-brand-sky"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="126" cy="285" r="24" className="fill-brand-coral/20" />
          <path
            d="M114 285h24m-12-12v24"
            className="stroke-brand-coral"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}
      {servicio === 'proceso' && (
        <>
          <path
            d="M100 106h280v74H100v74h280"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 8"
          />
          {[
            {x: 100, y: 106},
            {x: 380, y: 106},
            {x: 100, y: 254},
            {x: 380, y: 254},
          ].map((punto, index) => (
            <g key={index}>
              <circle
                cx={punto.x}
                cy={punto.y}
                r="30"
                className={index === 3 ? 'fill-brand-coral' : 'fill-white'}
                stroke="currentColor"
                strokeWidth="3"
              />
              <text
                x={punto.x}
                y={punto.y + 7}
                textAnchor="middle"
                fill="currentColor"
                className="text-xl font-bold"
              >
                {index + 1}
              </text>
            </g>
          ))}
          <rect x="181" y="148" width="118" height="65" rx="14" className="fill-brand-ink" />
          <path
            d="m220 180 14 14 26-27"
            className="stroke-brand-sky"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
