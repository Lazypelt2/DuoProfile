import React, { Fragment, useState } from "react";
export default Loading;

function Loading() {
  return (
    <div
      className="container py-5 mt-5"
      style={{ justifyContent: "center", textAlign: "center" }}
    >
      <img src="./duoLoad.gif" style={{ height: "10%", width: "10%" }}></img>
    </div>
  );
}
