<template>
  <svg width="480" height="180" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Pies examples by Josef 2011-Feb-23-->
    <defs>
      <g id="quarter_pies">
        <path
          d="M0,0 L0,-200  A200,200 0 0,1  200,000  z"
          style="fill:#ff0000;fill-opacity: 1;stroke:black;stroke-width: 1"
        />
        <path
          d="M0,0 L-200,0  A200,200 0 0,1    0,-200 z"
          style="fill:green;fill-opacity: 1;stroke:black;stroke-width: 1"
        />
        <path
          d="M0,0 L0,200   A200,200 0 0,1 -200,0    z"
          style="fill:blue;fill-opacity: 1;stroke:black;stroke-width: 1"
        />
        <path
          d="M0,0 L200,0   A200,200 0 0,1    0,200  z"
          style="fill:pink;fill-opacity: 1;stroke:black;stroke-width: 1"
        />
      </g>
      <g id="one_quarter_pie">
        <path
          d="M0,0 L0,-200  A200,200 0 0,1    200,0  z"
          style="fill:#ff0000;fill-opacity: 1;stroke:black;stroke-width: 1"
        />
        <path
          d="M0,0 L200,0   A200,200 0 1,1    0,-200 z"
          style="fill:green;fill-opacity: 1;stroke:black;stroke-width: 1"
        />
      </g>
      <g id="exploded_quarter_pie">
        <path
          d="M30,-30 L30,-230  A200,200 0 0,1  230,-30  z"
          style="fill:#ff0000;fill-opacity: 1;stroke:black;stroke-width: 1"
        />
        <path
          d="M0,0 L200,0   A200,200 0 1,1    0,-200 z"
          style="fill:green;fill-opacity: 1;stroke:black;stroke-width: 1"
        />
      </g>
    </defs>

    <rect x="0" y="0" width="100%" height="100%" fill="#fde" />
    <text
      x="110"
      y="28"
      style="font-family: Arial;font-size: 26;stroke:red; fill:red;"
    >Quater Circle Pies</text>
    <use transform="translate(60,100) scale(0.25,0.25)" xlink:href="#quarter_pies" />
    <use transform="translate(180,100)  scale(0.25,0.25)" xlink:href="#one_quarter_pie" />
    <use transform="translate(300,100)  scale(0.25,0.25)" xlink:href="#exploded_quarter_pie" />
    <use
      transform="translate(420,100)  scale(0.25,0.25) rotate(-45)"
      xlink:href="#exploded_quarter_pie"
    />
  </svg>
</template>

<script>
export default {
  name: "Circle",
};
</script>

<style scoped>
</style>
