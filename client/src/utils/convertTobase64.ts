export const convertToBase64 = (
  selectedFile: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 250;
        const maxHeight = 250;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the image on the canvas
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Get the base64 representation with reduced size
        const base64Data = canvas.toDataURL("image/png");

        resolve(base64Data);
      };

      if (e.target) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = (error) => reject(error);
    // Read the selected image as a data URL
    reader.readAsDataURL(selectedFile);
  });
};
