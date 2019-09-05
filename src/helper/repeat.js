import sketch from 'sketch';
import { Slice } from 'sketch/dom';
import { exportFormat } from '../config';

export default function repeat(num, direction) {
  const doc = sketch.getSelectedDocument();
  // const page = doc.selectedPage;
  const selectedSlices = doc.selectedLayers.layers.filter(l => l.type === 'Slice');

  if (selectedSlices.length < 1) {
    return;
  }

  const oirginSlice = selectedSlices[0];
  const slices = [];
  let name = oirginSlice.name;
  let xOffset;
  let yOffset;
  if (direction === 'x') {
    xOffset = oirginSlice.frame.width;
    yOffset = 0;
  } else {
    xOffset = 0;
    yOffset = oirginSlice.frame.height;
  }
  for (let i = 0; i < num; i++) {
    const order = i + 1;
    slices.push(
      new Slice({
        name: `${name}-repeat-${order}`,
        frame: {
          x: oirginSlice.frame.x + xOffset * order,
          y: oirginSlice.frame.y + yOffset * order,
          width: oirginSlice.frame.width,
          height: oirginSlice.frame.height,
        },
        exportFormats: [exportFormat],
      })
    );
  }

  inserBefore(oirginSlice.parent.layers, oirginSlice, slices.reverse());
}

function inserBefore(arr, target, insertions) {
  const index = arr.findIndex(a => a.id === target.id);
  arr.splice(index, ...insertions.concat(target));
}
