/// < reference types='cypress' />

describe("Test with backend using headless authorization", () => {
  before("login to app", () => {
    cy.intercept("GET", "https://api.realworld.io/api/tags", {
      fixture: "tags.json",
    });
    cy.loginToApplicationHead();
  });

  /*** Intercept Calls ***/

  it("Verify correct request & response", () => {
    cy.intercept("POST", "https://api.realworld.io/api/articles/").as(
      "postArticles"
    );

    cy.contains("New Article").click();
    cy.get('[placeholder="Article Title"]').type("This is the API Title");
    cy.get(`[placeholder="What's this article about?"]`).type(
      "This is description"
    );
    cy.get('[formcontrolname="body"]').type("This is body text");
    cy.get("form").contains("Publish Article").click();

    cy.wait("@postArticles");
    cy.get("@postArticles").then((xhr) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(201);
      expect(xhr.request.body.article.body).to.be.eql("This is body text");
      expect(xhr.response.body.article.description).to.equal(
        "This is description"
      );
    });

    cy.wait(2000);
    cy.get(".article-actions").contains("Delete Article").click();
    cy.wait(2000);
  });

  /*** Tags Interception ***/
  it("Test tags interceptions and mock response", () => {
    console.log("Tags are displayed");
  });

  /*** API Calls */

  it("delete global feed from API", () => {
    const userCredentials = {
      user: {
        email: "Saurabh_test@gmail.com",
        password: "Pass@134",
      },
    };

    const bodyData = {
      article: {
        title: "Test title API",
        description: "About API",
        body: "Description test API",
        tagList: [],
      },
    };

    cy.request(
      "POST",
      "https://api.realworld.io/api/users/login",
      userCredentials
    )
      .its("body")
      .then((body) => {
        const token = body.user.token;

        cy.request({
          url: "https://api.realworld.io/api/articles",
          headers: { Authorization: "Token " + token },
          method: "POST",
          body: bodyData,
        }).then((response) => {
          const slug = response.body.article.slug;
          expect(response.status).to.equal(201);

          cy.request({
            url: `https://api.realworld.io/api/articles/${slug}`,
            headers: { Authorization: "Token " + token },
            method: "DELETE",
            body: bodyData,
          }).then((response) => {
            expect(response.status).to.equal(204);
          });
        });

        //cy.contains("Global Feed").click();
        //cy.wait(4000);
        //cy.get(".article-preview").first().click();
        //cy.get(".article-actions").contains("Delete Article").click();

        cy.request({
          url: "https://api.realworld.io/api/articles?limit=10&offset=0",
          headers: { Authorization: "Token " + token },
          method: "GET",
        })
          .its("body")
          .then((body) => {
            expect(body.articles[0].title).not.to.equal("Test title API");
          });
      });
  });
});

describe("Test with backend using headless authorization", () => {
  before("login to app", () => {
    cy.loginToApplicationHeadless();
  });

  it("delete global feed from API", () => {
    const bodyData = {
      article: {
        title: "Test title API",
        description: "About API",
        body: "Description test API",
        tagList: [],
      },
    };

    cy.get("@token").then((token) => {
      cy.request({
        url: "https://api.realworld.io/api/articles",
        headers: { Authorization: "Token " + token },
        method: "POST",
        body: bodyData,
      }).then((response) => {
        const slug = response.body.article.slug;
        expect(response.status).to.equal(201);

        cy.request({
          url: `https://api.realworld.io/api/articles/${slug}`,
          headers: { Authorization: "Token " + token },
          method: "DELETE",
          body: bodyData,
        }).then((response) => {
          expect(response.status).to.equal(204);
        });
      });

      // cy.contains("Global Feed").click();
      // cy.wait(4000);
      // cy.get(".article-preview").first().click();
      // cy.get(".article-actions").contains("Delete Article").click();

      cy.request({
        url: "https://api.realworld.io/api/articles?limit=10&offset=0",
        headers: { Authorization: "Token " + token },
        method: "GET",
      })
        .its("body")
        .then((body) => {
          expect(body.articles[0].title).not.to.equal("Test title API");
        });
    });
  });
});
