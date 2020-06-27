const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const FieldValue = require("firebase-admin").firestore.FieldValue;
import { Change, EventContext } from "firebase-functions";
import * as firebase from "firebase-admin";

export const documentWriteListener = functions.firestore
  .document("projects/{projectId}/images/{imageId}")
  .onWrite((change: Change<any>, context: EventContext) => {
    const projectId: string = context.params.projectId;
    const imageId: string = context.params.imageId;
    const firestore = admin.firestore();
    const docRef: firebase.firestore.DocumentReference = firestore
      .collection("projects")
      .doc(projectId);

    if (!change.before.exists) {
      // New document Created : add one to count
      return docRef
        .collection("images")
        .get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          const imageCount = querySnapshot.size;
          const batch: firebase.firestore.WriteBatch = firestore.batch();
          batch.update(docRef, { numberOfImages: FieldValue.increment(1) });
          batch.update(docRef.collection("images").doc(imageId), {
            position: imageCount,
          });
          batch.commit().catch((err) => console.log(err));
        })
        .catch((err: any) => console.log(err));
    } else if (change.before.exists && change.after.exists) {
      // Updating existing document : Do nothing
    } else if (!change.after.exists) {
      // Deleting document : subtract one from count

      return docRef
        .update({ numberOfDocs: FieldValue.increment(-1) })
        .catch((err) => console.log(err));
    }

    return 0;
  });
