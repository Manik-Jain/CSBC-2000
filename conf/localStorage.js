import LocalStorage from 'local-storage-es6'

function localStorageInstance() {
    return new LocalStorage({
        path: './cache',
        key: '0PTsIIb+mRmzCbGfU6Vus2jVllom1fJ9Yu6x8HdUisjjXSfo1lQOA+LHIbGhB2mbn8N9N1FT7mI8oeqzli8oei9ff7BqkwfIwDoLLoyN1+kxL54oM9V3uOyEX2vjk68PX4a/Es92U3YXAHb46qGP3KZKAb5YR6qlFBIVSdAM8q8=',
        encryptFileName: true,
        encryptFileContent: false
    })
}

export default localStorageInstance