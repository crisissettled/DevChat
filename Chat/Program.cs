using Chat.Model;
using Chat.signalR;
using Chat.Utils;
using Chat.Utils.Crypto;
using Chat.Utils.Middleware;
using Chat.Utils.MongoDb;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(options => {
    options.AddSecurityDefinition(name: "Bearer", securityScheme: new OpenApiSecurityScheme {
        Name = "Authorization",
        Description = "Enter the Bearer Authorization string as following: `Bearer Generated-JWT-Token`",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Name = "Bearer",
                In = ParameterLocation.Header,
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});
builder.Services.AddSignalR();
builder.Services.AddMemoryCache();
builder.Services.AddAuthentication(options => {
    // Identity made Cookie authentication the default.
    // However, we want JWT Bearer Auth to be the default.
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Jwt.AccessSecret)),
        ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 },
        ValidIssuer = Jwt.Issuer,
        ValidAudience = Jwt.Audience,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromSeconds(0)
    };
    options.Events = new JwtBearerEvents {
        OnMessageReceived = context => {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/chat")) {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context => {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                context.Response.Headers.Add("tokenErr", "expired");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddSingleton<ICrypto, Crypto>();
builder.Services.AddSingleton<IChatSessions, ChatSessions>();

builder.Services.AddMongoDbServices();
builder.Services.AddFluentValidators();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseRouting();

app.MapHub<ChatHub>("/hubs/chat");

app.UseMiddleware<JwtMiddleware>();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
