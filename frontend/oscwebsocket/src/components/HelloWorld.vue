<script >
import axios from "axios";
export default {
  name: "HelloWorld",

  data() {
    return {
      msg: "MY OSC - Websocket App ",
      connection: null,
      wsmesg: "as",
      datamain: {},
      canvas: null,
      color: "",
      imagbase64: "",
      inputs: { image: "<base 64 image>" },
      inputtag: "",
      zfloat: 0.0,
      switchstate: false,
    };
  },
  methods: {
    posttorunway: function () {
      console.log(this.inputtag);
      let zfloatarray = [];
      for (let index = 0; index < 128; index++) {
        zfloatarray[index] = Math.random() * this.zfloat;
      }
      zfloatarray[0] = 0;
      console.log(zfloatarray);
      axios
        .post("http://localhost:8000/query", {
          category: this.inputtag,
          z: zfloatarray,
        })
        .then((response) => {
          console.log(response);
          this.imagbase64 = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  mounted() {
    //Websocket code

    console.log("HelloWorld mounted.");
    let connection = new WebSocket("ws://localhost:8080/");
    connection.onmessage = (event) => {
      // Vue data binding means you don't need any extra work to
      // update your UI. Just set the `time` and Vue will automatically
      // update the `<h2>`.
      //console.log(event);
      this.datamain = JSON.parse(event.data);
    };
    this.canvas = document.getElementById("myCanvas");

    //draw ever 0.1 seconds
    setInterval(() => {
      //update wakinator output
      this.wsmesg = this.datamain.payload.args;
      let ctx = this.canvas.getContext("2d");
      ctx.moveTo(
        this.datamain.payload.args[2] * 500,
        this.datamain.payload.args[3] * 700
      );
      ctx.lineTo(
        this.datamain.payload.args[0] * 300,
        this.datamain.payload.args[1] * 600
      );
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }, 20);
    setInterval(() => {
      // select color
      this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }, 50);

    //for getting 0 image
    /* axios
      .get("http://localhost:8000/data")
      .then((response) => {
        console.log(response);
        this.imagbase64 = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .post("http://localhost:8000/query", JSON.stringify(this.inputs))
      .then((response) => {
        console.log(response);
        this.imagbase64 = response.data;
      }); */
  },
};
</script>


<template>
  <div>
    <h3>Switch between OSC-WSS & runway BIGGAN</h3>
    <label class="switch">
      <input type="checkbox" v-model="switchstate" />
      <span class="slider"></span>asd
    </label>
    <div v-if="switchstate">
      <img
        id="osc-wss"
        alt="Vue logo"
        src="https://findlogovector.com/wp-content/uploads/2019/08/osc-orange-cinema-series-logo-vector.png"
      />
      <h1>{{ msg }}</h1>
      Wakinator output
      <div>
        <span> {{ wsmesg }}</span>
        <h1>Drawing with mousemove event</h1>
        <canvas id="myCanvas" width="560" height="360" />
      </div>
    </div>
    <div v-if="!switchstate">
      <h1>BigGan</h1>
      <input type="text" v-model="inputtag" />
      <input type="number" v-model="zfloat" />
      <button @click="posttorunway">post</button>
      <br />
      <div>
        <img :src="imagbase64.generated_output" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
#myCanvas {
  border: 1px solid #d4d4d4;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}
#osc-wss {
  widows: 100px;
  height: 100px;
}
input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
