"use strict";

class wrtc {
  constructor() {
    this.mediaConstraints= { audio: true, video: true };
    this.hasAddTrack= false;
    this.myUsername='';
    this.peerCon='';
  }
  getHost = () => {
    const hostName = window.location.hostname;
    console.log("hostname: " + hostName);
  };
  log = text => {
    var time = new Date();
    console.log("[" + time.toLocaleTimeString() + "] " + text);
  };
  // Output an error message to console.
  log_error = text => {
    var time = new Date();
    console.error("[" + time.toLocaleTimeString() + "] " + text);
  };
  setUsername = username => {
    sendToServer({
      //data to send to server
    });
  };
  connect = hostname => {
    const scheme = "ws";
    const port = 6503;

    const serverUrl = scheme + "://" + hostname + ":" + port;
    connection = new WebSocket(serverUrl, "json");

    connection.onopen = function(evt) {
      //enable typing and sending
    };

    connection.onmessage = function(evt) {
      const msg = JSON.parse(evt.data);
      log("Message received: ");
      console.dir(msg);

      let text = "";
      const time = new Date(msg.date);
      const timeStr = time.toLocaleTimeString();

      //does different action depending on the received message type
      switch (msg.type) {
        case "id":
          clientID = msg.id;
          this.setUsername();
          break;
        case "username":
          text =
            "(" +
            timeStr +
            ") User: " +
            msg.username +
            " has signed in" +
            "<br>";
          break;
        case "message":
          text = "(" + timeStr + ") " + msg.username + ": " + msg.text + "<br>";
          break;
        case "rejectusername":
          //reject username
          break;
        case "userlist":
          //handle userlist
          break;
        case "video-offer": // Invitation and offer to chat
          //handleVideoOfferMsg(msg);
          break;

        case "video-answer": // Callee has answered our offer
          //handleVideoAnswerMsg(msg);
          break;

        case "new-ice-candidate": // A new ICE candidate has been received
          //handleNewICECandidateMsg(msg);
          break;

        case "hang-up": // The other peer has hung up the call
          //handleHangUpMsg(msg);
          break;

        default:
          this.log_error("Unknown message received:");
          this.log_error(msg);
      }
    };
  };

  sendButton = () => {
    //send text to server
  };

  handleKey = () => {
    //handle keypress ie enter/return for sending messages
  };

  createPeerConnection = wrtc => {
    this.log("setting up peer connection...");
    wrtc.peerCon = new RTCPeerConnection({
      iceServers: [{}]
    });

    //hasaddtrack = wrtc.peerCon.addTrack !== undefined
    //not sure if necessary

    wrtc.peerCon.onIceCandidate = handleICECandidateEvent;
    wrtc.peerCon.onRemoveStream = handleRemoveStreamEvent;
    wrtc.peerCon.onIceConnectionStateChange = handleICEConnectionStateChangeEvent;
    wrtc.peerCon.onIceGatheringStateChange = handleICEGatheringStateChangeEvent;
    wrtc.peerCon.onSignalingStateChange = handleSignalingStateChangeEvent;
    wrtc.peerCon.onNegotiationNeeded = handleNegotiationNeededEvent;
  };

  handleNegotiationNeededEvent = () => {
    this.log("**negotation needed");
    this.log("creating offer");
    this.peerCon.createOffer().then(function(offer) {
      log("---> Creating new description object to send to remote peer");
      return this.peerCon.setLocalDescription(offer);
    })
    .then(function() {
      this.log("---> Sending offer to remote peer");
      this.sendToServer({
        // name: myUsername,
        // target: targetUsername,
        // type: "video-offer",
        // sdp: myPeerConnection.localDescription
      });
    })
  .catch(this.reportError);
  };
  handleTrackEvent=(event)=> {
    this.log("*** Track event");
    // document.getElementById("received_video").srcObject = event.streams[0];
    // document.getElementById("hangup-button").disabled = false;
  }
  handleAddStreamEvent=(event)=> {
    this.log("*** Stream added");
    // document.getElementById("received_video").srcObject = event.stream;
    // document.getElementById("hangup-button").disabled = false;
  }
  handleRemoveStreamEvent=(event)=>{
    this.log("**Stream removed");
    this.closeVideoCall();
  }
  handleICECandidateEvent=(event)=> {
    if (event.candidate) {
      this.log("Outgoing ICE candidate: " + event.candidate.candidate);
  
      this.sendToServer({
        // type: "new-ice-candidate",
        // target: targetUsername,
        // candidate: event.candidate
      });
    }
  }
  handleICEConnectionStateChangeEvent=(event)=> {
    this.log("*** ICE connection state changed to " + this.peerCon.iceConnectionState);
  
    switch(this.peerCon.iceConnectionState) {
      case "closed":
      case "failed":
      case "disconnected":
        this.closeVideoCall();
        break;
    }
  }
  handleSignalingStateChangeEvent=(event)=> {
    this.log("*** WebRTC signaling state changed to: " + peerCon.signalingState);
    switch(peerCon.signalingState) {
      case "closed":
        this.closeVideoCall();
        break;
    }
  }
  handleICEGatheringStateChangeEvent=(event)=> {
    this.log("*** ICE gathering state changed to: " + peerCon.iceGatheringState);
  }
  handleUserlistMsg=(msg)=>{
    const i;
    const listElem =''
    //where to place list box
    for(let i = 0; i<msg.users.length;i+=1){
      //populate
      //probably will fit better in a component
    }
  }
  closeVideoCall=()=>{
    const remoteVideo=''//received video location
    const localVideo=''//received video location
    this.log('closing the call')
    if(this.peerCon){
      peerCon.onAddStream = null;  // For older implementations
      peerCon.onTrack = null;      // For newer ones
      peerCon.onRemoveStream = null;
      peerCon.onIceCandidate = null;
      peerCon.onIceConnectionStateChange = null;
      peerCon.onSignalingStateChange = null;
      peerCon.onIceGatheringStateChange = null;
      peerCon.onNegotiationNeeded = null;
    }
    //stop videos with x.stop();
    //src = null
    this.peerCon.close();
    peerCon=null;
    //clear username
  }

  handleHangupMsg=(msg)=>{
    this.log('**Other party hung up')
    this.closeVideoCall();
  }

  hangUpCall=()=>{
    this.closeVideoCall();
    this.sendToServer({
      //    name: myUsername,
      // target: `targetUsername,
      // type: "hang-up`"
    })
  }


  //this needs to be attached to each of the users in the userlist
  //actually this needs to be broken into two parts, one to choose and one to create connection
invite=(evt)=> {
  this.log("Starting to prepare an invitation");
  if (peerCon) {
    alert("You can't start a call because you already have one open!");
  } else {
    var clickedUsername = evt.target.textContent;

    // Record the username being called for future reference
    targetUsername = clickedUsername;
    this.log("Inviting user " + targetUsername);

    // Call createPeerConnection() to create the RTCPeerConnection.
    this.log("Setting up connection to invite user: " + targetUsername);
    this.createPeerConnection();

    // Now configure and create the local stream, attach it to the
    // "preview" box (id "local_video"), and add it to the
    // RTCPeerConnection.
    this.log("Requesting webcam access...");

    navigator.mediaDevices.getUserMedia(mediaConstraints)
    .then(function(localStream) {
      this.log("-- Local video stream obtained");
      //connect to the video div
      // document.getElementById("local_video").src = window.URL.createObjectURL(localStream);
      // document.getElementById("local_video").srcObject = localStream;

      if (hasAddTrack) {
        this.log("-- Adding tracks to the RTCPeerConnection");
        localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
      } else {
        this.log("-- Adding stream to the RTCPeerConnection");
        myPeerConnection.addStream(localStream);
      }
    })
    .catch(handleGetUserMediaError);
  }
}

handleVideoOfferMsg(msg){
  const localStream = null;

  targetUsername=msg.name;

  this.log("Starting to accept invitation from " + targetUsername);
  this.createPeerConnection();

  const desc = new RTCSessionDescription(msg.sdp);

  this.peerCon.setRemoteDescription(desc).then(()=>{
    this.log("setting up local media stream...")
    return navigator.mediaDevices.getUserMedia(mediaConstraints);
  })
  .then(stream=>{
    this.log("--local video stream connection obtained");
    localStream = stream;
//     document.getElementById("local_video").src = window.URL.createObjectURL(localStream);
// document.getElementById("local_video").srcObject = localStream;
    if(this.hasAddTrack){
      this.log('adding tracks to RTC conn')
      localStream.getTracks().forEach(track=>this.peerCon.addTrack(track,localStream))
    }else{
      this.log('adding stream to RTC peer con')
      this.peerCon.addStream(localStream);
    }
  })
  .then(()=>{
    this.log('======> creating answer')
    return this.peerCon.createAnswer();
  })
  .then(answer=>{
    this.log('setting local description after creating answer');

    return this.peerCon.setLocalDescription(answer);
  })
  .then(()=>{
    const msg = {
//       name: myUsername,
//       target: targetUsername,
//       type: "video-answer",
//       sdp: myPeerConnection.localDescription
    }

  this.log('sending answer packet back to other peer')
  this.sendToServer(msg);

  }).catch(handleGetUserMediaError);
}

handleNewICECandidateMsg(msg) {
  const candidate = new RTCIceCandidate(msg.candidate);

  this.log("Adding received ICE candidate: " + JSON.stringify(candidate));
  peerCon.addIceCandidate(candidate)
    .catch(reportError);
}

handleGetUserMediaError(e){
  this.log(e);
  switch(e.name) {
    case "NotFoundError":
      alert("Unable to open your call because no camera and/or microphone" +
            "were found.");
      break;
    case "SecurityError":
    case "PermissionDeniedError":
      // Do nothing; this is the same as the user canceling the call.
      break;
    default:
      alert("Error opening your camera and/or microphone: " + e.message);
    break;
  }
this.closeVideoCall();
}

reportError(errMessage){
  this.log_error("Error "+errMessage.name+": "+errMessage.message);
}

}

const wRTC = new wrtc();
export default wRTC;
