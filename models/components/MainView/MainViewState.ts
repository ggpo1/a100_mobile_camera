import PhotoCommandStateType from '../../PhotoCommandStateType';
export default interface MainViewState {
    hasPermission: boolean,
    scanned: boolean,
    hostIp: string,
    photoCommandState: PhotoCommandStateType
}