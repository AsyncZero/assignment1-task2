// Variable Declarations
let postId = null;
let image;
let message;

// Retrive images and comments from database and show
const retrieveImages = function () {
  $.get("/imageretrieve", (images) => {
    console.log(images);
    $("#images").empty();
    images.forEach(function (image) {
      const imageComments = $("<div class='col container'><div>");
      image.comments.forEach((comment) => {
        const imageComment = `<div class='col s6 comment'><i class='material-icons left' style='color:white font-size: larger;'>chat_bubble_outline</i>${comment}</div>`;
        imageComments.append(imageComment);
      });
      const temp = imageComments.html();
      const imageHTML = `<div class='col s6 imageBox' container><img class="materialboxed" data-caption="${image.message}" width="400" src="${image.image}" alt="centered image"></img><div><h5 >Description: ${image.message}</h5></div><div class='col s12 commentsContainer row '>${temp}</div><div class='col s12 center'><a id='buttonComment' onclick=imageId(this) value=${image._id} class='waves-effect waves-light btn modal-trigger' href='#modalComments'>Comment</a><div></div>`;
      const imageEntry = $(imageHTML);
      $("#images").append(imageEntry);
      $(".materialboxed").materialbox();
    });
  });
};

// Set the ID of the Image the comment is posting to
const imageId = (element) => {
  const commentImage = $(element);
  postId = commentImage.attr("value");
};

// Submit the comment using POST with the ID of the image it will attach to
const submitComment = () => {
  const comment = $("#commentBox").val();
  const data = {
    postId,
    comment,
  };
  // console.log(data);
  $.post("/imagecomment", data, () => {
    $("#commentBox").val("");
  });
  retrieveImages();
};

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

// DOM Ready
$(document).ready(function () {
  // console.log("Ready");
  $(".modal").modal();

  $("#post").click(() => {
    const imageFile = $("#fileUpload").prop("files")[0];
    convert(imageFile);
  });

  retrieveImages();
});
