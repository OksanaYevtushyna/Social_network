import { profileApiData } from '../api/api';
import { stopSubmit } from 'redux-form';

const ADD_POST = 'ADD-POST';
const SET_USER_PROFILE = 'SET_USER_PROFILE';
const SET_USER_STATUS = 'SET_USER_STATUS';
const DELETE_POST = 'DELETE_POST';
const CHANGE_PHOTO = 'CHANGE_PHOTO';

let initialState = {
    postsData: [
        { id: 1, message: 'Hello world!', likeCount: 12, srcImage: 'https://www.biletik.aero/upload/resize_cache/medialibrary/807/compressed/807f262b60da392f1e09aa6d33f20a9b.jpg' },
        { id: 2, message: 'Life is great!', likeCount: 43, srcImage: 'https://cdna.artstation.com/p/assets/images/images/020/382/532/smaller_square/marco-franco-post-avatar-macf-original.jpg' },
        { id: 3, message: 'Props is done.', likeCount: 28, srcImage: 'https://i.pinimg.com/236x/7c/bb/27/7cbb270385783c329a26945143f8b275--post-avatar.jpg' }
    ],
    newPostData: 'Hey',
    userProfile: null,
    status: '',
    profilePhoto: null
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            let newEnteredPost = action.newPost
            let newPost = {
                id: 4, message: newEnteredPost, likeCount: 0, srcImage: 'https://econet.ru/uploads/pictures/456173/content_199820.jpg'
            }
            return {
                ...state,
                postsData: [...state.postsData, newPost]
            }
        case SET_USER_PROFILE:
            return {
                ...state,
                userProfile: action.profile
            }
        case SET_USER_STATUS:
            return {
                ...state,
                status: action.status
            }
        case DELETE_POST:
            return {
                ...state,
                postsData: state.postsData.filter(p => p.id !== action.postId)
            }
        case CHANGE_PHOTO:
            return {
                ...state,
                userProfile: { ...state.userProfile, photos: action.photo }
            }
        default:
            return state;
    }

    /*if (action.type === ADD_POST) {
        let newPost = {
            id: 4, message: state.newPostData, likeCount: 0, srcImage: 'https://cs8.pikabu.ru/post_img/big/2016/01/31/7/1454239523124489716.png'
        }
        state.postsData.push(newPost);
        state.newPostData = '';
    } else if (action.type === ENTER_NEW_POST) {
        state.newPostData = action.updatePost;
    }

    return state;*/
}

export const addPostActionCreator = (newPost) => ({ type: ADD_POST, newPost });
export const setUserProfile = (profile) => ({ type: SET_USER_PROFILE, profile: profile });
export const setStatus = (status) => ({ type: SET_USER_STATUS, status });
export const deletePost = (postId) => ({ type: DELETE_POST, postId })
export const changePhoto = (photo) => ({ type: CHANGE_PHOTO, photo })

export const getUserIdThunk = (userId) => async (dispatch) => {
    let respons = await profileApiData.getUserId(userId);
    dispatch(setUserProfile(respons.data));
}

export const getUserStatusThunk = (userId) => async (dispatch) => {
    let respons = await profileApiData.getUserStatus(userId)
    dispatch(setStatus(respons.data));
}

export const updateStatusThunk = (status) => async (dispatch) => {
    let respons = await profileApiData.updateStatus(status)
    if (respons.data.resultCode === 0) {
        dispatch(setStatus(status));
    }
}

export const changeUserProfilePhotoThunk = (photo) => async (dispatch) => {
    let respons = await profileApiData.changePhoto(photo)
    if (respons.data.resultCode === 0) {
        dispatch(changePhoto(respons.data.data.photos));
    }
}

export const updateContactDataThunk = (profile) => async (dispatch, getState) => {
    const userId = getState().authReducer.userId
    let respons = await profileApiData.updateProfileContacts(profile);
    if (respons.data.resultCode === 0) {
        dispatch(getUserIdThunk(userId));
    } else {
        let errorMessage = respons.data.messages.length > 0 ? respons.data.messages[0] : 'Some error'
        dispatch(stopSubmit('contact', { _error: errorMessage }));
        return Promise.reject(respons.data.messages[0]);
    }
}

export default profileReducer;