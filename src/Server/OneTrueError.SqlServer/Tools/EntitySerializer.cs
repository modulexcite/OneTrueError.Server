using System;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using OneTrueError.Infrastructure;

namespace OneTrueError.SqlServer.Tools
{
    /// <summary>
    /// Used for serialization of DB entities (typically value objects or child entities)v.
    /// </summary>
    public class EntitySerializer
    {
        public static string Serialize(object dto)
        {
            var jsonSerializerSettings = new JsonSerializerSettings()
            {
                ContractResolver = new IncludeNonPublicMembersContractResolver(),
                TypeNameHandling = TypeNameHandling.Objects
            };
            jsonSerializerSettings.Converters.Add(new StringEnumConverter());
            return JsonConvert.SerializeObject(dto, typeof(object),
                jsonSerializerSettings);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"><c>DBNull</c> or <c>string</c></param>
        /// <returns></returns>
        public static T Deserialize<T>(object json) 
        {
            if (json is DBNull)
                return default(T);

            var settings = new JsonSerializerSettings()
            {
                ContractResolver = new IncludeNonPublicMembersContractResolver(),
                ConstructorHandling = ConstructorHandling.AllowNonPublicDefaultConstructor,
            };
            //settings.Converters.Add(new DomainTriggerRuleJsonConverter());
            settings.Converters.Add(new StringEnumConverter());
            return JsonConvert.DeserializeObject<T>((string)json, settings);
        }

    }
}