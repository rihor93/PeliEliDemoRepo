export const replaceImgSrc = (newPath: any) =>
  ({ currentTarget }: React.SyntheticEvent<HTMLImageElement, Event>) => {
    currentTarget.onerror = null;
    currentTarget.src = newPath
  }

export const isDevelopment = () => process.env.NODE_ENV === 'development'