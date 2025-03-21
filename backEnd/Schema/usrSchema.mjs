export const usrSchema={
    name:{
        notEmpty:{
            errorMessage:"Name cannot be null"
        },
        isLength:{
            options:{
                min:5,
                max:32
            },
            errorMessage:"name must be between 5 and 32 characters"
        }
    },
    email:{
        notEmpty:{
            errorMessage:"Email cannot be null"
        },
        isLength:{
            options:{
                min:5,
                max:32
            },
            errorMessage:"email must be between 5 and 32 characters"
        }
    },
    password:{
        notEmpty:{
            errorMessage:"Password cannot be null"
        },
        isLength:{
            options:{
                min:5,
                max:32
            },
            errorMessage:"password must be between 5 and 32 characters"
        }

    },
    date:{
        notEmpty:{
            errorMessage:"date cannot be null"
        },
    }
}