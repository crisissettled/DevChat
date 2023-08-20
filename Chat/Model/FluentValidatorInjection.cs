using Chat.Model.Request;
using FluentValidation;

namespace Chat.Model {
    public static class FluentValidatorInjection {

        public static IServiceCollection AddFluentValidators(this IServiceCollection services) {
            services.AddValidatorsFromAssemblyContaining<SignUpRequestValidator>();
            services.AddValidatorsFromAssemblyContaining<UserFriendRequestValidator>();

            return services;
        }
    }
}
