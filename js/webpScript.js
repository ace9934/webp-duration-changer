var data = null

function handleFiles(files) {
  var readerDataURL = new FileReader();
  var readerArrayBuffer = new FileReader();
  var img = new Image();
  var file = files[0];

  if (files.length == 0)
  {
    data = null
    if (document.getElementById("beforeImage") !== null)
      document.getElementById("before").removeChild(document.getElementById("beforeImage"));
    return;
  }

  readerDataURL.onload = function(e) {
    var dataURL = e.target.result;
    img.src = dataURL;
    img.id = "beforeImage"
    if (document.getElementById("beforeImage") !== null)
      document.getElementById("before").removeChild(document.getElementById("beforeImage"));
    document.getElementById("before").appendChild(img);
//    img.onload = function() { }
  }
  readerDataURL.readAsDataURL(file);

  readerArrayBuffer.onload = function(e) {
    data = new Uint8Array(e.target.result);
  }
  readerArrayBuffer.readAsArrayBuffer(file);
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i=0, strlen=str.length; i<strlen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
 return buf;
}

function getAllIndexes() {
  var res = [], val, i

  var ab = new Uint8Array(str2ab("ANMF"))
  val = ab[0]
  for (i = data.indexOf(val); i < data.length; i++) {
    if (data[i] === val) {
      if (ab.toString() === data.slice(i, i + ab.length).toString()) {
        res.push(i)
      }
    }
  }
  return res;
}

function makeImage() {
  if (data == null) {
    alert("File not found: Select file first!")
    return
  }

  var indexes = getAllIndexes()
  var duration = document.getElementById("duration").value
  var idx0, idx1

  for (i = 0; i < indexes.length; i++) {
    idx0 = indexes[i] + 0x14;
    idx1 = idx0 + 1;

    data[idx0] = duration % 0x100
    data[idx1] = Math.floor(duration / 0x100)
  }

  var img = new Image
  img.src = "data:image/webp;base64," + ab2b64Data()
  img.id = "afterImage"
  if (document.getElementById("afterImage") !== null)
    document.getElementById("after").removeChild(document.getElementById("afterImage"));
  document.getElementById("after").appendChild(img)
}

function ab2b64Data() {
  var binary = '';
  for (var i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i])
  }
  return window.btoa(binary)
}
