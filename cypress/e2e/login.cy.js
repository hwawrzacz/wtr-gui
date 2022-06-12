import users from '../fixtures/users.json'
import userFalsy from '../fixtures/users-falsy.json'

function closeFaceLoginWindow() {
    cy.get('app-face-login-dialog')
        .get('button')
        .contains('Anuluj')
        .click()
}

function openCredentialLoginWindow() {
    cy.get('button')
        .contains('Logowanie hasłem')
        .click()
}

function typeCredentialsAndSubmit(user) {
    cy.get('input').first().type(user.login)
    cy.get('input[type=password]').type(user.password)
    cy.get('button').contains('Zaloguj').click()
}

describe('Login page', () => {
    beforeEach(() => {
        window.sessionStorage.clear()
        cy.visit('localhost:4200')
    })

    users.forEach(user => {
        it(`logs user with '${user.role}' role in`, () => {
            closeFaceLoginWindow()
            openCredentialLoginWindow()
            typeCredentialsAndSubmit(user)

            // Check if the url is correct
            cy.url().should('equal', 'http://localhost:4200/tasks')

            // Check if the logged full user name is correct
            cy.get('app-header')
                .get('app-profile-widget')
                .get('span.user-name')
                .should('have.text', user.fullName)
        })
    })

    it(`does not log in user with incorrect password`, () => {
        closeFaceLoginWindow()
        openCredentialLoginWindow()
        typeCredentialsAndSubmit(userFalsy)

        cy.get('app-error-snack-bar').contains('Nie udało się zalogować.')
    })
})
