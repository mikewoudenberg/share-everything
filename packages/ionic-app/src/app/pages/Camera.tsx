import { IonButton, IonPage } from '@ionic/react';
import { Camera as CapCamera, CameraResultType } from '@capacitor/camera';
import { useEffect, useState } from 'react';

const Camera: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);

  const requestPermissions = () => {
    console.log('requesting permission');

    CapCamera.requestPermissions({ permissions: ['camera'] })
      .then(
        (permission) =>
          !['prompt', 'prompt-with-rationale'].includes(permission.camera)
      )
      .then((bool) => setHasPermissions(bool));
  };

  const takePicture = async () => {
    const image = await CapCamera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    if (image.webPath) {
      setImageSrc(image.webPath);
    }
  };

  useEffect(() => {
    const getPermissions = async () => {
      return CapCamera.checkPermissions().then(
        (permission) =>
          !['prompt', 'prompt-with-rationale'].includes(permission.camera)
      );
    };

    if (hasPermissions === null) {
      getPermissions().then((bool) => setHasPermissions(bool));
    }
  });

  return (
    <IonPage id="camera-page">
      <h2>Camera</h2>
      {imageSrc && <img src={imageSrc} alt="My awesome" />}
      {!imageSrc && hasPermissions && (
        <IonButton onClick={() => takePicture()}>Take Picture</IonButton>
      )}
      {!hasPermissions && (
        <IonButton onClick={() => requestPermissions()}>
          Request Permissions
        </IonButton>
      )}
    </IonPage>
  );
};

export default Camera;
