const render = (imgUrl) => {
  const imgContainer = document.getElementById("imgContainer");
  const imgElement = document.createElement("img");

  imgElement.className = "img";
  imgElement.id = "img";
  imgElement.src = imgUrl;
  imgElement.alt = "Photo view image";

  imgContainer.appendChild(imgElement);

  let scale = 1;
  const offset = 1;
  const zoomInElement = document.getElementById("zoom-in");
  const zoomOutElement = document.getElementById("zoom-out");
  const downloadElement = document.getElementById("download");

  zoomInElement.addEventListener("click", () => {
    if (imgElement) {
      scale += offset;

      if (scale > 5) scale = 5;

      imgElement.style.transform = `scale(${scale})`;
    }
  });

  zoomOutElement.addEventListener("click", () => {
    if (imgElement) {
      scale -= offset;

      if (scale < 1) scale = 1;

      imgElement.style.transform = `scale(${scale})`;
    }
  });

  downloadElement.addEventListener("click", () => {
    window.photoViewAPI.download(imgUrl);
  });
};

window.addEventListener("DOMContentLoaded", () => {
  window.photoViewAPI.onReceiveImgUrl((_event, url) => {
    console.log(url);
    render(url);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.close();
    }
  });
});
