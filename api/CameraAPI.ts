import BaseUrl from './BaseUrl';
import PhotoCommandStateType from './../models/PhotoCommandStateType';

export default class CameraAPI {
    public static async getPhotoCommandState(): Promise<PhotoCommandStateType> {
        let url = BaseUrl.url + 'api/cameraevents';
        return new Promise((resolve => {
            fetch(url, {
                method: 'GET',
            }).then((response) => response.json()).then((body) => {
                resolve(body);
            }).catch(() => {
                console.log('fetchor!');
            })
        }));
    }

    public static async setPhotoCommandState(image: any): Promise<any> {
        let url = BaseUrl.url + 'api/cameraevents/updateevent';
        return new Promise((resolve => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: 0,
                    VikId: 0,
                    Image: image,
                    IsDone: true
                }),
            })
            .then((response) => response.status.toString())
            .then((status) => {
                if (status === '200') alert('Фото отправлено!');
                else alert('Ошибка!');
            })
        }));
    }
}