import classnames from "classnames";
export { v4 as uuidv4 } from "uuid";

export const mergeClassNames = (origin: any, added: any) =>
  classnames({ [origin]: !!origin, [added]: true });

export const strEnumType = <T extends string>(o: Array<T>): { [K in T]: K } => {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
};

export const currentDate = () => {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const contractDateFormat = window.__INITIAL_STATE__.contractDateFormat;

   // Replacing placeholders in the contractDateFormat with actual values
   const formattedDate = contractDateFormat
   .replace("dd", dd)
   .replace("MM", mm)
   .replace("yyyy", yyyy);

  //const currentDate = mm + "/" + dd + "/" + yyyy;
  return formattedDate ;
};

export const percentageSliderFormatter = (value: number | undefined) => (
  <>{value ? Math.round(value * 100) : "0"}%</>
);

export const degreeSliderFormatter = (value: number | undefined) => (
  <>{value ? Math.round(value) : "0"}°</>
);

export const refreshPage = () => {
  return window.location.reload();
};

/**
 * convert base 64 to file blob
 * @param b64Data: base 64 pdf data
 * @returns blob: blob file type
 */
export const b64toBlob = ({
  b64Data,
  sliceSize = 512,
}: {
  b64Data: string;
  sliceSize?: number;
}) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays);

  return blob;
};
