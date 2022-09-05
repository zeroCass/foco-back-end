const signin = dispatch => {
    console.log('params:', dispatch)
    return ({ email, password }) => {
        console.log('singin: ', email)
        dispatch({
            type: 'signin',
            payload: {
                token: 'acess token',
                email,
            }
        })
    }
}

const signup = dispatch => {
    return ({ email, password }) => {
        console.log('singup: ', email)
    }
}


const authReduce = (state, action) => {
    switch(action.type) {
        case 'signin':
            return {
                email: action.payload.email,
                token: action.payload.token,
            }
    }
}


const createDataContext =  (reducer, action, defaultValue) => {
    const boundActions = {}

    for(let key in action) {
        boundActions[key] = action[key](() => console.log('dispatch'))
    }
    boundActions.signin({ email: 'email@email', password: '123' })
}   

createDataContext(authReduce, { signin, signup }, {})