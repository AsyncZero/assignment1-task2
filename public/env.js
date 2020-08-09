const retrieveImages = function () {
  $.get("/images", (images) => {
    console.log(images);
    $("#images").empty();
    images.forEach(function (image) {
      console.log(image);
      // $("#images").append('<div class="row image" >' + image.image + "</div>");
      $("#images").append(
        `<img class="materialboxed" width="650" src="${image.image}"></img>`
      );
    });
  });
};

$(document).ready(function () {
  console.log("Ready");

  $("#btnMessage").click(() => {
    let image = $("#imageBox").val();
    let message = $("#messageBox").val();
    let data = {
      image,
      message,
    };
    $.get("/imageinsert", data, () => {
      $("#messageBox").val("");
      $("#imageBox").val("");
    });
  });

  setInterval(() => {
    retrieveImages();
  }, 1000);
});
