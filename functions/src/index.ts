const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const FieldValue = require("firebase-admin").firestore.FieldValue;
import { Change, EventContext } from "firebase-functions";
import * as firebase from "firebase-admin";

export const documentWriteListener = functions.firestore
  .document("projects/{projectId}/images/{imageId}")
  .onWrite((change: Change<any>, context: EventContext) => {
    const projectId = context.params.projectId;
    const imageId = context.params.imageId;
    const docRef = admin.firestore().collection("projects").doc(projectId);

    if (!change.before.exists) {
      // New document Created : add one to count
      docRef
        .collection("images")
        .doc(imageId)
        .get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          const imageCount = querySnapshot.size;
          docRef.update({ numberOfImages: FieldValue.increment(1) });
          docRef
            .collection("images")
            .doc(imageId)
            .update({ position: imageCount });
        });
    } else if (change.before.exists && change.after.exists) {
      // Updating existing document : Do nothing
    } else if (!change.after.exists) {
      // Deleting document : subtract one from count

      docRef.update({ numberOfDocs: FieldValue.increment(-1) });
    }

    return;
  });
