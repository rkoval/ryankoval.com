import {useState, type ImgHTMLAttributes} from 'react';

/**
 * An <img> that starts transparent and fades in once the image has finished
 * loading. Honors any extra className passed in.
 */
export function FadeImage({className = '', onLoad, ...props}: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
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
