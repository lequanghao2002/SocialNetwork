using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialNetwork.Migrations
{
    public partial class updatepostfollow : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows");

            migrationBuilder.RenameColumn(
                name: "FollowerId",
                table: "Follows",
                newName: "follwing");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Follows",
                newName: "follower");

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SharedPostId",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_follower",
                table: "Follows",
                column: "follower",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_follower",
                table: "Follows");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "SharedPostId",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "follwing",
                table: "Follows",
                newName: "FollowerId");

            migrationBuilder.RenameColumn(
                name: "follower",
                table: "Follows",
                newName: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
