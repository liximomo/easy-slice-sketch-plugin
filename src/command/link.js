import sketch from 'sketch';

export default function() {
  const doc = sketch.getSelectedDocument();
  // const page = doc.selectedPage;
  const selectedSlices = doc.selectedLayers.layers.filter(l => l.type === 'Slice');

  if (selectedSlices.length < 2) {
    return;
  }

  selectedSlices.sort((a, b) => Number(a.name) - Number(b.name));
  let head = selectedSlices.shift();

  for (const sclie of selectedSlices) {
    sclie.frame.x = head.frame.x;
    sclie.frame.y = head.frame.y + head.frame.height;
    head = sclie;
  }
}
