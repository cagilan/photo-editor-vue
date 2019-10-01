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
              <b-card-text v-show="showPhotoEditor">
                <b-button variant="outline-primary" @click="addToStore(photoDetails)">Save</b-button>
                <b-button variant="outline-primary" @click="RotateCanvasImage">Rotate</b-button>
                <b-button variant="outline-primary" @click="ScaleCanvasImage">Scale</b-button>
                <b-button variant="outline-primary" @click="ResetCanvasImage">Reset</b-button>
              </b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <canvas height="960" width="1440" id="imageCanvas" ref="imageCanvas"></canvas>
    <div v-show="showPhotoDesc">
      <b-card no-body class="overflow-hidden text-center">
        <b-row no-gutters>
          <b-col md="12">
            <b-card-body title="Print Description">
              <b-card-text>{{photoDetails.name}}</b-card-text>
              <b-card-text>{{photoDetails.size}}</b-card-text>
              <b-card-text>{{photoDetails.type}}</b-card-text>
              <b-card-text>{{photoDetails.lastModifiedDate}}</b-card-text>
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
  i = 0;
export default {
  name: "HelloWorld",
  data: function() {
    return {
      photoDetails: [],
      showPhotoDesc: false,
      showPhotoEditor: false
    };
  },
  methods: {
    /**
     * Add to store.
     *
     * @param {object} photo
     * @public
     */
    addToStore(photo) {
      photo.src = img.src;
      Store.addToStore(photo);
    },

    getLastUploadedPhoto() {
      if (Store.store && Store.store.length) {
        this.photoDetails = Store.store.pop();
        this.showPhotoDesc = true;
        img.src = this.photoDetails.src;
      }
    },

    updateCanvasImage(e) {
      var self = this;
      this.showPhotoDesc = false;

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

    fitImageOn(canvas, imageObj) {
      var imageAspectRatio = imageObj.width / imageObj.height;
      var canvasAspectRatio = canvas.width / canvas.height;
      var renderableHeight, renderableWidth, xStart, yStart;
      var context = canvas.getContext("2d");

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
      context.clearRect(0, 0, 1200, 1000);
      context.drawImage(
        imageObj,
        xStart,
        yStart,
        renderableWidth,
        renderableHeight
      );
    },

    drawCanvasImage(img) {
      this.showPhotoEditor = true;
      var canvas = this.$refs.imageCanvas;

      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 1200, 1000);
      //ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      this.fitImageOn(canvas, img);
    },

    RotateCanvasImage() {
      var canvas = this.$refs.imageCanvas;
      var context = canvas.getContext("2d");
      context.save();
      context.translate(img.width / 2, img.height / 2);
      context.rotate(i / 180 / Math.PI);
      context.drawImage(img, -(img.width / 2), -(img.height / 2));
      context.restore();
      i += 10;
    },

    ScaleCanvasImage() {
      var canvas = this.$refs.imageCanvas;
      var context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      context.scale(1.5, 2.0);
      context.drawImage(img, 50, 0);
    },

    ResetCanvasImage() {
      var canvas = this.$refs.imageCanvas;
      var context = canvas.getContext("2d");
      context.scale(1, 1);
      context.drawImage(img, 0, 0);
    },

    generatePhotoDetails() {
      this.showPhotoDesc = true;
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
#imageCanvas {
  border: 1px solid red;
}
</style>
