const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
import { EventContext } from "firebase-functions";
import * as firebase from "firebase-admin";
const db = admin.firestore();

export const documentWriteListener = functions.firestore
  .document("projects/{projectId}/images/{imageId}")
  .onCreate(
    (snapshot: firebase.database.DataSnapshot, context: EventContext) => {
      const projectId: string | null | undefined =
        snapshot.ref.parent?.parent?.key;
      const imageId: string | null = snapshot.ref.key;

      if (imageId === null || projectId === null) {
        return 0;
      }

      const projectRef: firebase.firestore.DocumentReference = db
        .collection("projects")
        .doc(projectId);

      // Update Customer
      const imageRef = projectRef.collection("images").doc(imageId);

      return db.runTransaction(
        async (transaction: firebase.firestore.Transaction) => {
          const project = (await transaction.get(projectRef)).data();

          const imageCount = project?.imageCount + 1;

          transaction.update(projectRef, {
            imageCount,
          });

          transaction.set(
            imageRef,
            {
              position: imageCount,
            },
            { merge: true }
          );
        }
      );
    }
  );
