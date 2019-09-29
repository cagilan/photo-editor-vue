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
              </b-card-text>
              <b-card-text v-show="showPhotoEditor">
                <b-button variant="outline-primary">Save</b-button>
                <b-button variant="outline-primary" @click="RotateCanvasImage">Rotate</b-button>
                <b-button variant="outline-primary" @click="ScaleCanvasImage">Scale</b-button>
                <b-button variant="outline-primary" @click="ResetCanvasImage">Reset</b-button>
              </b-card-text>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <canvas height="500" width="700" id="imageCanvas" ref="imageCanvas"></canvas>
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

    drawCanvasImage(img) {
      this.showPhotoEditor = true;
      var canvas = this.$refs.imageCanvas;
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
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
