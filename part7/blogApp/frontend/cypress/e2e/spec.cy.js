describe('Blog App', () => {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user1 = {
      name: 'Hrishikesh',
      username: 'hrishi',
      password: 'HRISHI'
    }
    const user2 = {
      name: 'Temporary',
      username: 'temp',
      password: 'temp'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user1)
    cy.request('POST', 'http://localhost:3001/api/users/', user2)
    cy.visit('')
  })

  describe('login', function () {

    it('login form can be opened', function() {
      cy.contains('login').click()
    })

    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('hrishi')
      cy.get('#password').type('HRISHI')
      cy.get('#login-button').click()

      cy.contains('Hrishikesh logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('hrishi')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Hrishikesh logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username:'hrishi', password: 'HRISHI' })
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title-input').type('This is a test title')
      cy.get('#author-input').type('Fake Author')
      cy.get('#url-input').type('testurl.xyz')
      cy.get('#submit-button').click()
      cy.contains('Fake Author')

      cy.get('.notification')
        .should('contain', 'blog added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.login({ username: 'hrishi', password: 'HRISHI' })
        cy.createBlog({ title: 'first title', author: 'first author', url: 'first url' })
        cy.createBlog({ title: 'second title', author: 'second author', url: 'second url' })
        cy.createBlog({ title: 'third title', author: 'third author', url: 'third url' })
      })

      it('one of those can be expanded to see extra details', function () {
        cy.contains('second title').find('button').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain', 'hide')
        cy.contains('second title').parent().contains('likes')
      })

      it('like button works in a expanded blog', function () {
        cy.contains('second title').find('button').click()
        cy.contains('second title').parent().contains('likes 0')
        cy.contains('second title').parent().contains('like').click()
        cy.contains('second title').parent().contains('likes 1')

        cy.get('.notification')
          .should('contain', 'blog liked')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')
      })

      it('user who created a blog can delete it', function () {
        cy.contains('second title').find('button').click()
        cy.contains('second title').parent().contains('Delete').click()

        cy.get('.notification')
          .should('contain', 'blog deleted')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')
      })

      describe('logout with current user and login with another', function () {
        beforeEach(function () {
          cy.contains('logout').click()
          cy.login({ username: 'temp', password: 'temp' })
        })

        it('New user cannot see delete button on blogs created by other users', function () {
          cy.contains('second title').find('button').click()
          cy.contains('second title').parent().should('not.contain', 'Delete')
        })

        it('New user can see delete button on the blog they created', function () {
          cy.createBlog({ title: 'new user title', author: 'new user author', url: 'new user url' })
          cy.contains('new user title').find('button').click()
          cy.contains('new user title').parent().should('contain', 'Delete')
        })
      })
    })

    describe('bloglist', function () {
      beforeEach(function () {
        cy.login({ username: 'hrishi', password: 'HRISHI' })
        cy.createBlog({ title: 'blog with lowest likes', author: 'last author', url: 'last url' })
        cy.createBlog({ title: 'blog with second most likes', author: 'second author', url: 'second url' })
        cy.createBlog({ title: 'blog with most likes', author: 'first author', url: 'first url' })
      })

      it('ordered according to likes count descending', function () {

        cy.contains('blog with lowest likes').find('button').click()

        cy.contains('blog with second most likes').find('button').click()
        cy.contains('blog with second most likes').parent().contains('likes 0')
        cy.contains('blog with second most likes').parent().contains(' like ').click()
        cy.contains('blog with second most likes').parent().contains('likes 1')

        cy.contains('blog with most likes').find('button').click()
        cy.contains('blog with most likes').parent().contains('likes 0')
        cy.contains('blog with most likes').parent().contains(' like ').click()
        cy.contains('blog with most likes').parent().contains('likes 1')
        cy.contains('blog with most likes').parent().contains(' like ').click()
        cy.contains('blog with most likes').parent().contains('likes 2')

        cy.get('.blog').eq(0).should('contain', 'blog with most likes')
        cy.get('.blog').eq(1).should('contain', 'blog with second most likes')
        cy.get('.blog').eq(2).should('contain', 'blog with lowest likes')

      })
    })
  })
})