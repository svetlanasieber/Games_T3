const { expect } = require('mocha');
const gameService = require('./GamesService.js'); 

describe("gameService Tests", function() {

    describe("getGames()", function() {
        it("should return a successful response with a list of games", function() {
            const response = gameService.getGames();
            
            // 1. Verify the response status is 200.
            expect(response.status).to.equal(200);
            
            // 2. Ensure the data is an array with a length of 3.
            expect(response.data).to.be.an('array').with.lengthOf(3);
            
            // 3. Check that the first game includes the required keys.
            expect(response.data[0]).to.include.keys('id', 'title', 'genre', 'year', 'developer', 'description');
        });
    });

    describe("addGame()", function() {
        it("should add a new game successfully", function() {
            const newGame = {
                id: "4",
                title: "Cyberpunk 2077",
                genre: "RPG",
                year: 2020,
                developer: "CD Projekt Red",
                description: "A futuristic RPG set in Night City."
            };
            
            // 1. Verify the response status is 201 and the success message is correct.
            const response = gameService.addGame(newGame);
            expect(response.status).to.equal(201);
            expect(response.message).to.equal("Game added successfully.");
            
            // 2. Check that the newly added game appears in the game list.
            const games = gameService.getGames().data;
            expect(games).to.have.lengthOf(4);
            expect(games[3]).to.deep.equal(newGame);
        });

        it("should return an error for invalid game data", function() {
            const invalidGame = { title: "Incomplete Game" }; // Missing required fields
            
            // 1. Check that the response status is 400 and the error message is "Invalid Game Data!".
            const response = gameService.addGame(invalidGame);
            expect(response.status).to.equal(400);
            expect(response.error).to.equal("Invalid Game Data!");
        });
    });

    describe("deleteGame()", function() {
        it("should delete an existing game by ID", function() {
            const gameId = "4"; // ID of the game added in the addGame test
            
            // 1. Delete a game by its ID.
            const response = gameService.deleteGame(gameId);
            
            // 2. Verify the response status is 200 and the success message is correct.
            expect(response.status).to.equal(200);
            expect(response.message).to.equal("Game deleted successfully.");
            
            // 3. Ensure the game is successfully removed from the list.
            const games = gameService.getGames().data;
            expect(games).to.have.lengthOf(3);
            expect(games.find(game => game.id === gameId)).to.be.undefined;
        });

        it("should return an error if the game is not found", function() {
            const nonExistentId = "999";
            
            // 1. Check that the response status is 404 and the error message is "Game Not Found!".
            const response = gameService.deleteGame(nonExistentId);
            expect(response.status).to.equal(404);
            expect(response.error).to.equal("Game Not Found!");
        });
    });

    describe("updateGame()", function() {
        it("should update an existing game with new data", function() {
            const updatedGame = {
                id: "1",
                title: "The Legend of Zelda: Updated",
                genre: "Action-adventure",
                year: 2017,
                developer: "Nintendo",
                description: "An updated description."
            };
            
            // 1. Verify the response status is 200 and the success message is correct.
            const response = gameService.updateGame("1", updatedGame);
            expect(response.status).to.equal(200);
            expect(response.message).to.equal("Game updated successfully.");
            
            // 2. Ensure the updated game is reflected in the game list.
            const games = gameService.getGames().data;
            const game = games.find(g => g.id === "1");
            expect(game).to.deep.equal(updatedGame);
        });

        it("should return an error if the game to update is not found", function() {
            const nonExistentId = "999";
            const newGame = {
                id: "999",
                title: "Non-existent Game",
                genre: "Puzzle",
                year: 2021,
                developer: "Unknown",
                description: "This game does not exist."
            };
            
            // 1. Check that the response status is 404 and the error message is "Game Not Found!".
            const response = gameService.updateGame(nonExistentId, newGame);
            expect(response.status).to.equal(404);
            expect(response.error).to.equal("Game Not Found!");
        });

        it("should return an error if the new game data is invalid", function() {
            const invalidGameData = { title: "Incomplete Game" }; // Missing fields
            const existingId = "1";
            
            // 1. Check that the response status is 400 and the error message is "Invalid Game Data!".
            const response = gameService.updateGame(existingId, invalidGameData);
            expect(response.status).to.equal(400);
            expect(response.error).to.equal("Invalid Game Data!");
        });
    });
});
