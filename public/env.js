// Retrive images from database and show
const retrieveImages = function () {
  $.get("/imageretrieve", (images) => {
    console.log(images);
    $("#images").empty();
    images.forEach(function (image) {
      console.log(image);
      // $("#images").append('<div class="row image" >' + image.image + "</div>");
      $("#images").append(
        `<img class="materialboxed" data-caption="${image.message}" width="400" src="${image.image}"></img>`
      );
      $(".materialboxed").materialbox();
    });
  });
};

let image;
let message;

// Convert image to base64 and upload to MongoDB
const convert = (file) => {
  const reader = new FileReader();
  reader.onloadend = function () {
    // console.log("RESULT", reader.result);
    let image = reader.result.toString();
    let message = $("#messageBox").val();
    const data = {
      image,
      message,
    };
    console.log(data);
    $.post("/imageinsert", data, () => {
      $("#messageBox").val("");
      $("#fileUpload").val("");
      let image = "";
      let message = "";
    });
    retrieveImages();
  };
  reader.readAsDataURL(file);
};

$(document).ready(function () {
  // console.log("Ready");
  $(".modal").modal();

  $("#post").click(() => {
    const imageFile = $("#fileUpload").prop("files")[0];
    convert(imageFile);
  });

  retrieveImages();
});
