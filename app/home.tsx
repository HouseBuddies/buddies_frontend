import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, FlatList } from 'react-native';

// Mock data for rental properties with owner information and avatars
const rentalProperties = [
  {
    id: '1',
    title: 'Modern Beachfront Villa',
    location: 'Miami, FL',
    price: '$2,500/month',
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.8,
      country: 'USA',
      countryFlag: '🇺🇸',
      animal: 'golden eagle'
    }
  },
  {
    id: '2',
    title: 'Downtown Luxury Apartment',
    location: 'New York, NY',
    price: '$3,200/month',
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
    owner: {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.9,
      country: 'Canada',
      countryFlag: '🇨🇦',
      animal: 'silver fox'
    }
  },
  {
    id: '3',
    title: 'Cozy Suburban Home',
    location: 'Austin, TX',
    price: '$1,800/month',
    bedrooms: 4,
    bathrooms: 3,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
    owner: {
      name: 'Jessica Williams',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 4.7,
      country: 'UK',
      countryFlag: '🇬🇧',
      animal: 'crimson hawk'
    }
  },
  {
    id: '4',
    title: 'Mountain View Cabin',
    location: 'Denver, CO',
    price: '$1,500/month',
    bedrooms: 2,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&auto=format&fit=crop',
    owner: {
      name: 'Robert Garcia',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      rating: 4.6,
      country: 'Germany',
      countryFlag: '🇩🇪',
      animal: 'amber wolf'
    }
  },
  {
    id: '5',
    title: 'Waterfront Penthouse',
    location: 'Seattle, WA',
    price: '$4,000/month',
    bedrooms: 3,
    bathrooms: 3,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
    owner: {
      name: 'Emma Thompson',
      avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
      rating: 5.0,
      country: 'Italy',
      countryFlag: '🇮🇹',
      animal: 'azure dolphin'
    }
  },
];

// Map-style avatar component
const MapAvatar = ({ owner }) => {
  return (
    <View className="absolute" style={{ top: Math.random() * 120 + 20, left: Math.random() * 220 + 20 }}>
      <View className="relative">
        <Image 
          source={{ uri: owner.avatar }} 
          className="w-[40px] h-[40px] rounded-full border-2 border-white shadow-md" 
        />
        <View className="absolute -bottom-1 -right-1 bg-white rounded-full w-[18px] h-[18px] items-center justify-center border border-gray-200">
          <Text className="text-[10px]">{owner.countryFlag}</Text>
        </View>
      </View>
    </View>
  );
};

// Recent visitor component (similar to the bottom of the image)
const RecentVisitor = ({ owner }) => {
  return (
    <View className="flex-row items-center mb-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5">
      <View className="w-[8px] h-[8px] bg-green-400 rounded-full mr-2" />
      <Text className="text-white text-xs font-medium mr-1">{owner.animal}</Text>
      <Text className="text-white/70 text-xs mr-1">from</Text>
      <Text className="text-xs mr-1">{owner.countryFlag}</Text>
      <Text className="text-white text-xs mr-1">{owner.country}</Text>
      <Text className="text-white/70 text-xs">visited</Text>
    </View>
  );
};

// Property card component with owner avatar
const PropertyCard = ({ property }) => {
  return (
    <TouchableOpacity className="w-[280px] bg-white rounded-xl overflow-hidden mr-4 shadow">
      <View className="relative">
        <Image 
          source={{ uri: property.image }} 
          className="w-full h-[160px]" 
          resizeMode="cover"
        />
        {/* Owner avatar badge overlaid on the image */}
        <View className="absolute -bottom-[15px] right-[15px] w-[40px] h-[40px] rounded-full bg-white justify-center items-center shadow p-[2px]">
          <Image 
            source={{ uri: property.owner.avatar }} 
            className="w-[36px] h-[36px] rounded-full" 
          />
          <View className="absolute -bottom-1 -right-1 bg-white rounded-full w-[18px] h-[18px] items-center justify-center border border-gray-200">
            <Text className="text-[10px]">{property.owner.countryFlag}</Text>
          </View>
        </View>
      </View>
      <View className="p-3">
        <Text className="text-base font-bold mb-1">{property.title}</Text>
        <Text className="text-sm text-gray-500 mb-1.5">{property.location}</Text>
        <Text className="text-base font-bold text-blue-500 mb-2">{property.price}</Text>
        <View className="flex-row mb-3">
          <Text className="text-xs text-gray-500 mr-2.5">{property.bedrooms} beds</Text>
          <Text className="text-xs text-gray-500">{property.bathrooms} baths</Text>
        </View>
        
        {/* Owner information */}
        <View className="flex-row items-center mt-2 pt-2 border-t border-gray-100">
          <Image 
            source={{ uri: property.owner.avatar }} 
            className="w-[30px] h-[30px] rounded-full" 
          />
          <View className="ml-2 flex-1">
            <View className="flex-row items-center">
              <Text className="text-xs font-medium">{property.owner.name}</Text>
              <Text className="text-xs ml-1 text-gray-500">({property.owner.animal})</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-xs text-amber-500 font-bold">★ {property.owner.rating}</Text>
              <Text className="text-xs ml-2">{property.owner.countryFlag} {property.owner.country}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Map visualization component
const MapVisualization = () => {
  return (
    <View className="relative w-full h-[300px] bg-[#1a1a2e] rounded-xl overflow-hidden mb-8">
      {/* Earth background */}
      <View className="absolute inset-0 bg-[#2a2a4a] rounded-full mx-auto my-auto w-[280px] h-[280px] opacity-90" />
      
      {/* Glow effect */}
      <View className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full mx-auto my-auto w-[300px] h-[300px]" />
      
      {/* Map image */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop' }} 
        className="absolute inset-0 w-full h-full opacity-50 rounded-xl"
        resizeMode="cover"
      />
      
      {/* User avatars on map */}
      {rentalProperties.map(property => (
        <MapAvatar key={property.id} owner={property.owner} />
      ))}
      
      {/* Recent visitors */}
      <View className="absolute bottom-4 left-4 right-4">
        {rentalProperties.map(property => (
          <RecentVisitor key={property.id} owner={property.owner} />
        ))}
      </View>
      
      {/* DataFast header */}
      <View className="absolute top-4 left-4 bg-black/30 backdrop-blur-md rounded-lg p-2">
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-orange-500 rounded-sm mr-2" />
          <Text className="text-white font-bold">DataFast</Text>
          <Text className="text-white/70 text-xs ml-2">| REAL-TIME</Text>
        </View>
        <View className="flex-row items-center mt-2">
          <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
          <Text className="text-white text-xs">{rentalProperties.length} active users on</Text>
          <Text className="text-white text-xs ml-1 font-medium">rentadream.com</Text>
        </View>
      </View>
    </View>
  );
};

const HomePage = () => {
    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView className="flex-grow p-5">
                <Text className="text-2xl font-bold mb-2.5 text-center mt-5">Welcome to RentADream</Text>
                <Text className="text-base text-gray-500 mb-5 text-center">Find your dream rental property today!</Text>
                
                <TouchableOpacity className="bg-blue-500 py-3 px-5 rounded-lg self-center mb-8">
                    <Text className="text-white text-base font-bold">Explore Listings</Text>
                </TouchableOpacity>
                
                {/* Map visualization */}
                <MapVisualization />
                
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold">Featured Listings</Text>
                        <TouchableOpacity>
                            <Text className="text-blue-500 text-sm">View All</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <FlatList
                        data={rentalProperties}
                        renderItem={({ item }) => <PropertyCard property={item} />}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="pr-5"
                    />
                </View>
                
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold">New Listings</Text>
                        <TouchableOpacity>
                            <Text className="text-blue-500 text-sm">View All</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <FlatList
                        data={rentalProperties.slice().reverse()}
                        renderItem={({ item }) => <PropertyCard property={item} />}
                        keyExtractor={item => `new-${item.id}`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="pr-5"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomePage;