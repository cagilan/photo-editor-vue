<template>
  <div class="journey">
    <div>
      <b-card no-body class="overflow-hidden">
        <b-row no-gutters>
          <b-col md="12">
            <b-card-body title="Select an Image file for print">
              <b-card-text>
                <label class="btn btn-info custom-file-upload">
                  <input type="file" id="imageLoader" @change="updateCanvasImage" />
                  Photo Upload
                </label>
                <b-button variant="success" @click="generatePhotoDetails">Submit</b-button>
                <b-button variant="info" @click="getLastUploadedPhoto">Import</b-button>
              </b-card-text>
              <b-alert
                :variant="msgVariant"
                :show="dismissCountDown"
                dismissible
                @dismissed="dismissCountDown=0"
                @dismiss-count-down="countDownChanged"
              >{{userMessage}}</b-alert>
              <b-card-text v-show="showPhotoEditor">
                <b-button variant="outline-primary" @click="addToStore(photoDetails);">Save</b-button>
                <b-button variant="outline-primary" @click="RotateCanvasImage">Rotate</b-button>
                <b-button variant="outline-primary" @click="ScaleCanvasImage">Scale</b-button>
                <b-button variant="outline-primary" @click="ResetCanvasImage">Reset</b-button>
              </b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <canvas v-show="isPhotoUploaded" height="960" width="1440" id="imageCanvas" ref="imageCanvas"></canvas>
    <div v-show="showPhotoDesc">
      <b-card no-body class="overflow-hidden text-center">
        <b-row no-gutters>
          <b-col md="12">
            <b-card-body title="Print Description">
              <b-card-text>Image Name: {{photoDetails.name}}</b-card-text>
              <b-card-text>Loaded Image w/dimensions: {{photoDetails.XPosition}}X{{photoDetails.YPosition}}</b-card-text>
              <b-card-text>Loaded Image position: {{photoDetails.imageWidth}}X{{photoDetails.imageHeight}}</b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script>
import { Store } from "../store/Store";

var img,
  i = 0,
  canvas,
  context;
export default {
  name: "PhotoEditor",
  data: function() {
    return {
      photoDetails: [],
      showPhotoDesc: false,
      showPhotoEditor: false,
      userMessage: false,
      dismissSecs: 5,
      dismissCountDown: 0,
      msgVariant: "success",
      isPhotoUploaded: false
    };
  },
  methods: {
    /**
     * Add to store.     *
     * @param {object} photo
     * @public
     */

    addToStore(photo) {
      photo.src = img.src;
      photo.XPosition = this.photoDetails.XPosition;
      photo.YPosition = this.photoDetails.YPosition;
      photo.imageWidth = this.photoDetails.imageWidth;
      photo.imageHeight = this.photoDetails.imageHeight;
      Store.addToStore(photo);
      this.msgVariant = "success";
      this.userMessage = "Saved Successfully!!!";
      this.showAlert();
    },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },

    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },

    /* getLastUploadedPhoto
     * To import recently uploaded image
     * @public
     */

    getLastUploadedPhoto() {
      if (Store.store && Store.store.length) {
        this.photoDetails = Store.store.slice(-1)[0];
        this.showPhotoDesc = true;
        img = new Image();
        img.src = this.photoDetails.src;
        this.drawCanvasImage(img);
        this.msgVariant = "success";
        this.userMessage = "Photo Imported Successfully!!!";
      } else {
        this.msgVariant = "danger";
        this.userMessage = "No photo is available to import";
      }
      this.showAlert();
    },

    /* updateCanvasImage
     * To update image on browse
     *@param {event} element to get recently uploaded element
     * @public
     */

    updateCanvasImage(e) {
      var self = this;
      this.showPhotoDesc = false;
      this.isPhotoUploaded = true;
      canvas = document.getElementById("imageCanvas");
      context = canvas.getContext("2d");

      var reader,
        files = e.target.files;

      var reader = new FileReader();

      reader.onload = e => {
        img = new Image();
        img.onload = function() {
          self.drawCanvasImage(img);
        };
        img.src = event.target.result;
      };
      self.photoDetails = files[0];
      reader.readAsDataURL(files[0]);
    },

    /* fitImageOn
     * To fit image on canvas
     *@param canvas element and imageObj image source
     * @public
     */

    fitImageOn(canvas, imageObj) {
      var imageAspectRatio = imageObj.width / imageObj.height;
      var canvasAspectRatio = canvas.width / canvas.height;
      var renderableHeight, renderableWidth, xStart, yStart;

      // If image's aspect ratio is less than canvas's we fit on height
      // and place the image centrally along width
      if (imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvas.height;
        renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
      }

      // If image's aspect ratio is greater than canvas's we fit on width
      // and place the image centrally along height
      else if (imageAspectRatio > canvasAspectRatio) {
        renderableWidth = canvas.width;
        renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
      }

      // Happy path - keep aspect ratio
      else {
        renderableHeight = canvas.height;
        renderableWidth = canvas.width;
        xStart = 0;
        yStart = 0;
      }
      this.photoDetails.XPosition = this.photoDetails.XPosition
        ? this.photoDetails.XPosition
        : Math.round(xStart);
      this.photoDetails.YPosition = this.photoDetails.YPosition
        ? this.photoDetails.YPosition
        : Math.round(yStart);
      this.photoDetails.imageWidth = this.photoDetails.imageWidth
        ? this.photoDetails.imageWidth
        : Math.round(renderableWidth);
      this.photoDetails.imageHeight = this.photoDetails.imageHeight
        ? this.photoDetails.imageHeight
        : Math.round(renderableHeight);
      context.clearRect(0, 0, 2000, 2000);
      context.drawImage(
        imageObj,
        this.photoDetails.XPosition,
        this.photoDetails.YPosition,
        renderableWidth,
        renderableHeight
      );
    },
    /**
     * drawCanvasImage
     * To draw canvas image
     * @public
     */

    drawCanvasImage(img) {
      this.fitImageOn(canvas, img);
    },
    /**
     * RotateCanvasImage
     * To rotate canvas image
     * @public
     */

    RotateCanvasImage() {
      context.save();
      context.translate(img.width / 2, img.height / 2);
      context.rotate(i / 180 / Math.PI);
      context.drawImage(img, -(img.width / 2), -(img.height / 2));
      context.restore();
      i += 10;
      this.photoDetails.XPosition = Math.round(-(img.width / 2));
      this.photoDetails.YPosition = Math.round(-(img.height / 2));
    },

    /**
     * ScaleCanvasImage
     * To resize canvas image
     * @public
     */

    ScaleCanvasImage() {
      context.drawImage(img, 0, 0);
      context.scale(1.5, 2.0);
      context.drawImage(img, 50, 0);
    },

    /**
     * ResetCanvasImage
     * Reset canvas image
     * @public
     */
    ResetCanvasImage() {
      context.scale(1, 1);
      context.drawImage(img, 0, 0);
    },

    /**
     * generatePhotoDetails
     * Generate photo details and description
     * @public
     */
    generatePhotoDetails() {
      if (Object.keys(this.photoDetails).length) {
        this.showPhotoEditor = true;
        this.msgVariant = "success";
        this.userMessage = "Submitted Successfully!!!";
        this.showPhotoDesc = true;
      } else {
        this.msgVariant = "danger";
        this.userMessage = "Please upload your photo";
      }
      this.showAlert();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
input[type="file"] {
  display: none;
}
.custom-file-upload {
  margin-top: 8px;
}
</style>
