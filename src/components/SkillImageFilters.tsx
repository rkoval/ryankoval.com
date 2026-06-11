/** SVG filter defs for skill icon dark-theme contrast (referenced from CSS). */
export function SkillImageFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute overflow-hidden">
      <defs>
        <filter
          id="skill-img-stroke-only"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilated" />
          <feComposite in="dilated" in2="SourceAlpha" operator="out" result="ring" />
          <feFlood floodColor="currentColor" result="flood" />
          <feComposite in="flood" in2="ring" operator="in" result="stroke" />
        </filter>
      </defs>
    </svg>
  );
}
