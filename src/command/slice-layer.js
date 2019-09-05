import sketch, { UI } from 'sketch';
import { Group, Slice } from 'sketch/dom';
import { exportFormat } from '../config';
// documentation: https://developer.sketchapp.com/reference/api/

function sliceFromLayer(layer, exportFormat, partNum = 1) {
  if (partNum === 1) {
    return new Slice({
      name: `${layer.name}-slice`,
      frame: layer.frame,
      exportFormats: [exportFormat],
    });
  }

  const { x, y, height, width } = layer.frame;
  const defaultSliceHeight = Math.floor(height / partNum);
  const slices = [];
  let remainHeight = height;
  for (let index = partNum - 1; index >= 0; index--) {
    const isLastSclie = index === 0;
    const sliceHeight = isLastSclie ? remainHeight : defaultSliceHeight;
    remainHeight = remainHeight - sliceHeight;
    const slice = new Slice({
      name: `${index + 1}`,
      frame: {
        x,
        y: y + remainHeight,
        width,
        height: sliceHeight,
      },
      exportFormats: [exportFormat],
    });
    slices.push(slice);
  }

  return slices;
}

export default function() {
  const doc = sketch.getSelectedDocument();
  const page = doc.selectedPage;
  const selectedLayers = doc.selectedLayers;

  if (selectedLayers.isEmpty) {
    sketch.UI.message('No layers are selected.');
    return;
  }

  let sliceNum = 0;
  UI.getInputFromUser(
    'Slice number?',
    {
      initialValue: '5',
      type: UI.INPUT_TYPE.string,
    },
    (err, value) => {
      if (err) {
        return;
      }

      sliceNum = parseInt(value, 10);
    }
  );

  if (sliceNum <= 0) return;
  const layer = selectedLayers.layers[0];
  const group = new Group({
    name: `${layer.name}-slices`,
  });
  const slices = sliceFromLayer(layer, exportFormat, sliceNum);
  group.layers.push(...slices);
  page.layers.push(group);
}
