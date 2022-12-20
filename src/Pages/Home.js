import React, { useState } from "react";
import styles from "./Home.module.less";
import img1 from "@/Assets/imgs/1.png";

export default function Home() {
  const [cnt, setCnt] = useState(1);
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>fdsfsdfsdgfdsg</span>
      <p>cnt: {cnt}</p>
      <button onClick={() => setCnt(cnt + 1)}>inc</button>
      <button onClick={() => setCnt(cnt - 1)}>dec</button>
      <div>
        img:
        <div>
          <img src={img1} />
        </div>
      </div>
    </div>
  );
}
console.log('_DEV_', __DEV__)