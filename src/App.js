import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import "./styles.css";

const MINIMUM_BOTTOM_SHEET_HEIGHT = 64;

export default function App() {
  const [open, setOpen] = useState(true);
  const [openBottom, setOpenBottom] = useState(true);
  // const [bottomHeight, setBottomHeight] = useState(MINIMUM_BOTTOM_SHEET_HEIGHT);

  // Animate the right sheet using react-spring
  const [{ width }, setWidth] = useSpring(() => ({
    width: 320,
    from: { width: 0 }
  }));

  const maxHeight = () => {
    // return document.body.clientHeight * 0.33; // This doesn't always work because initially the page isn't ready
    return 350;
  };

  // Animate the bottom sheet using react-spring
  const [{ height }, setHeight] = useSpring(() => ({
    from: { height: 0 },
    height: MINIMUM_BOTTOM_SHEET_HEIGHT
  }));

  // Mouse and touch event handling using react-use-gesture
  const bindHeight = useDrag(
    ({ down, offset, xy }) => {
      // console.log(`xy=${xy}`);
      console.log(
        `Inside useDrag handler down=${down} offset[1]=${
          offset[1]
        } setting height=${MINIMUM_BOTTOM_SHEET_HEIGHT - offset[1]}`
      );

      setHeight({
        height: MINIMUM_BOTTOM_SHEET_HEIGHT - offset[1]
      });
    },
    {
      bounds: { top: -maxHeight() + MINIMUM_BOTTOM_SHEET_HEIGHT, bottom: 0 }, // Not sure how to dynamically set the top value to 33% of the window
      rubberband: true,
      initial: {}
    }
  );

  const toggleRightSide = () => {
    if (open) {
      setWidth({ width: 0 });
    } else {
      setWidth({ width: 320 });
    }
    setOpen(!open);
  };

  const toggleBottom = () => {
    if (openBottom) {
      setHeight({ height: 0 });
    } else {
      setHeight({ height: maxHeight() }); // TODO - use local storage to remember where it was
    }
    setOpenBottom(!openBottom);
  };

  const closeRightSide = () => {
    setWidth({ width: 0 });
    setOpen(false);
  };

  const closeBottom = () => {
    setHeight({ height: 0 });
    setOpenBottom(false);
  };

  // Bind it to a component
  return (
    <>
      <header>
        Header
        <button onClick={toggleBottom}>Toggle Bottom</button>
        <button onClick={toggleRightSide}>Toggle Right</button>
      </header>
      <div className="main">
        <div className="left">left</div>
        <div className="center">
          Center
          <animated.div
            className="bottomSheet"
            {...bindHeight()}
            style={{ height }}
          >
            Bottom Sheet
            <button onClick={closeBottom}>Close</button>
          </animated.div>
        </div>

        <animated.div className="right" style={{ width: width }}>
          <button onClick={closeRightSide}>Close</button>
        </animated.div>
      </div>
      <footer>footer</footer>
      {/* <animated.div className="App" {...bind()} style={{ left: x, top: y }} /> */}
    </>
  );
}
