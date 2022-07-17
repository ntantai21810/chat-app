let index = 0;
let imgUrls = [];

const render = (imgUrl, urls) => {
  const imgContainer = document.getElementById("imgContainer");
  const imgList = document.getElementById("imgList");
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

  imgList.innerHTML = "";

  for (let i = 0; i < urls.length; i++) {
    const el = document.createElement("div");
    const img = document.createElement("img");

    el.className = "imgItem" + (i === index ? " active" : "");

    img.classList = "img";
    img.src = urls[i];
    img.alt = "Photo view image";

    el.appendChild(img);

    el.addEventListener("click", () => {
      index = i;
      render(urls[index], urls);
    });

    imgList.append(el);

    if (i === index) {
      imgList.scrollTop = el.offsetTop;
    }
  }

  downloadElement.addEventListener("click", () => {
    window.photoViewAPI.download(imgUrl);
  });
};

window.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowUp":
        index = index - 1 < 0 ? 0 : index - 1;
        break;
      case "ArrowDown":
        index = index + 1 > imgUrls.length - 1 ? imgUrls.length - 1 : index + 1;
        break;
    }

    render(imgUrls[index], imgUrls);
  });

  window.photoViewAPI.onReceiveImgUrl((_event, { idx, urls }) => {
    index = idx;
    imgUrls = urls;
    render(urls[idx], urls);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.close();
    }
  });
});
