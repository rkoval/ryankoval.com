import {useLayoutEffect, useRef, useState, type ImgHTMLAttributes} from 'react';

/**
 * An <img> that starts transparent and fades in once the image has finished
 * loading. Honors any extra className passed in.
 */
export function FadeImage({className = '', onLoad, ...props}: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // SSR/hydration and cached images may finish loading before onLoad is attached.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete) {
      setLoaded(true);
    }
  }, [props.src]);

  return (
    <img
      ref={imgRef}
      {...props}
      loading={props.loading ?? 'lazy'}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={`transition duration-500 ease-out ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
}
