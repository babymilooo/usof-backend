module.exports = class UserDto {
    login;
    email;
    id;

    constructor(model) {
        this.email = model.email;
        this.login = model.login;
        this.id = model.id;
    }
}