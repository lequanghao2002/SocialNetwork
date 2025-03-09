using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.Entities;
using System.Reflection.Emit;
using System.Security.Cryptography.X509Certificates;

namespace SocialNetwork.Data
{
    public class SocialNetworkDbContext : IdentityDbContext<User>
    {
        public SocialNetworkDbContext(DbContextOptions<SocialNetworkDbContext> option) : base(option)
        {

        }

        #region DbSet
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Favourite> Favourites { get; set; }
        public DbSet<Message> Messages { get; set; }
        #endregion

        protected override async void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.ToTable("UserProfiles");
                entity.HasKey(up => up.UserId);

                entity.HasOne(up => up.User)
                    .WithOne(u => u.UserProfile)
                    .HasForeignKey<UserProfile>(up => up.UserId);
            });

            modelBuilder.Entity<Follow>(entity =>
            {
                entity.ToTable("Follows");
                entity.HasKey(f => new { f.follower, f.follwing });

                entity.HasOne(f => f.User)
                    .WithMany(u => u.Follows)
                    .HasForeignKey(f => f.follower);
            });

            modelBuilder.Entity<Friendship>(entity =>
            {
                entity.ToTable("Friendships");
                entity.HasKey(fs => new { fs.RequesterId, fs.AddresseeId });

                entity.HasOne(fs => fs.Requester)
                    .WithMany(u => u.SentFriendRequests)
                    .HasForeignKey(fs => fs.RequesterId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(fs => fs.Addressee)
                    .WithMany(u => u.ReceivedFriendRequests)
                    .HasForeignKey(fs => fs.AddresseeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.ToTable("Posts");
                entity.HasKey(p => p.Id);

                entity.HasOne(p => p.User)
                    .WithMany(u => u.Posts)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(p => p.SharedPost)
                   .WithMany() // Không cần danh sách bài viết chia sẻ
                   .HasForeignKey(p => p.SharedPostId)
                   .OnDelete(DeleteBehavior.NoAction); // Không tự động xóa bài chia sẻ
            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.ToTable("Tags");
                entity.HasKey(p => p.Id);
            });

            modelBuilder.Entity<PostTag>(entity =>
            {
                entity.ToTable("PostTags");
                entity.HasKey(pt => new {pt.PostId, pt.TagId});

                entity.HasOne(pt => pt.Tag)
                    .WithMany(t => t.PostTags)
                    .HasForeignKey(pt => pt.TagId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pt => pt.Post)
                    .WithMany(p => p.PostTags)
                    .HasForeignKey(pt => pt.PostId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Like>(entity =>
            {
                entity.ToTable("Likes");
                entity.HasKey(l => new { l.UserId, l.PostId });

                entity.HasOne(l => l.User)
                    .WithMany(u => u.Likes)
                    .HasForeignKey(l => l.UserId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(l => l.Post)
                    .WithMany(p => p.Likes)
                    .HasForeignKey(l => l.PostId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("Comments");
                entity.HasKey(c => c.Id);

                entity.HasOne(c => c.User)
                    .WithMany(u => u.Comments)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(c => c.Post)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(c => c.PostId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Favourite>(entity =>
            {

                entity.ToTable("Favourites");
                entity.HasKey(f => new { f.PostId, f.UserId });

                entity.HasOne(f => f.User )
                    .WithMany(u => u.Favourites)
                    .HasForeignKey(pt => pt.UserId)
                     .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(f => f.Post)
                    .WithMany(p => p.Favourites)
                    .HasForeignKey(pt => pt.PostId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.ToTable("Messages");
                entity.HasKey(m => m.Id);

                entity.HasOne(m => m.Sender)
                    .WithMany(u => u.SentMessages)
                    .HasForeignKey(m => m.SenderId)
                    .OnDelete(DeleteBehavior.Restrict); // Không xóa tin nhắn khi xóa user

                entity.HasOne(m => m.Receiver)
                    .WithMany(u => u.ReceivedMessages)
                    .HasForeignKey(m => m.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);

            });

            ConfigIdentityCore(modelBuilder);
        }

        public void ConfigIdentityCore(ModelBuilder modelBuilder)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var tableName = entityType.GetTableName();
                if (tableName.StartsWith("AspNet"))
                {
                    entityType.SetTableName(tableName.Substring(6));
                }
            }

            var adminRoleId = "25d9875c-878d-414e-8e6f-b4c28815f739";
            var userRoleId = "9cd0f7a2-741d-405a-a8a3-a34b22da200c";
            var roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Id = adminRoleId,
                    ConcurrencyStamp = adminRoleId,
                    Name = "Admin",
                    NormalizedName = "Admin".ToUpper(),
                },
                new IdentityRole
                 {
                    Id = userRoleId,
                    ConcurrencyStamp = userRoleId,
                    Name = "User",
                    NormalizedName = "User".ToUpper()
                }
            };

            modelBuilder.Entity<IdentityRole>().HasData(roles);
        }
    }
}
