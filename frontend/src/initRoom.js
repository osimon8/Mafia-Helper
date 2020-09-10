const initRoom = (room) => {

    room.state.onChange = (changes) => {
        console.log(changes);
        // changes.forEach(change => {
        //     console.log(change.field);
        //     console.log(change.value);
        //     console.log(change.previousValue);
        // });
    };

    room.onMessage("messages", (message) => {
        console.log("message received from server");
        console.log(message);
      });

}

export {initRoom};