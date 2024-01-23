worker.onMessage(function (res) {
    console.log(res)
    if(res == 'getCameraFrameData'){
        worker.postMessage(worker.getCameraFrameData())
    }
})
