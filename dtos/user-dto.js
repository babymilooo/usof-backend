module.exports = class UserDto {
    login;
    email;
    id;
    fullName;
    profilePicture;
    rating;
    role;

    constructor(model) {
        this.email = model.email;
        this.login = model.login;
        this.id = model.id;
        this.profilePicture = model.profilePicturel;
        this.rating = model.rating;
        this.role = model.role;
        this.fullName = model.fullName;
    }
}