const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
import { EventContext, Change } from "firebase-functions";
import * as firebase from "firebase-admin";
const db = admin.firestore();

export const documentWriteListener = functions.firestore
  .document("projects/{projectId}/images/{imageId}")
  .onWrite(
    (
      change: Change<firebase.firestore.DocumentSnapshot>,
      context: EventContext
    ) => {
      const projectId: string = context.params.projectId;
      const imageId: string = context.params.imageId;

      const projectRef: firebase.firestore.DocumentReference = db
        .collection("projects")
        .doc(projectId);
      if (!change.before.exists) {
        // Update Customer
        const imageRef = projectRef.collection("images").doc(imageId);

        return db.runTransaction(
          async (transaction: firebase.firestore.Transaction) => {
            const project = (await transaction.get(projectRef)).data();

            let imageCount = project?.imageCount + 1;

            if(!imageCount) {
              imageCount = 0;
            }

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
      } else {
        return 0;
      }
    }
  );
