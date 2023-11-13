<template>
  <div class="beer-recommendation">
    <h2>啤酒推荐</h2>
    <div class="beer-list">
      <div v-for="beer in recommendedBeers" :key="beer.id" class="beer-item">
        <img :src="beer.image" :alt="beer.name" class="beer-image" />
        <div class="beer-details">
          <h3>{{ beer.name }}</h3>
          <p>{{ beer.description }}</p>
          <p>酒精度: {{ beer.alcoholPercentage }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recommendedBeers: [
        {
          id: 1,
          name: '品牌1',
          description: `
          百位酿酒大师，传承百年工艺；

          融汇百种酿法，经过千锤百炼；酿于百年酒厂，藏于百年橡桶;

          集合百味芳香，酿就百年传奇;
          
          百酿成传奇……。`,
          alcoholPercentage: 5.0,
          image: 'https://example.com/beer1.jpg',
        },
        // 添加更多的啤酒推荐数据
      ],
    };
  },
};
</script>

<style scoped>
.beer-recommendation {
  padding: 20px;
}

.beer-list {
  display: flex;
  flex-wrap: wrap;
}

.beer-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 10px;
  padding: 10px;
  width: 300px;
}

.beer-image {
  max-width: 100%;
  border-radius: 8px;
}

.beer-details {
  margin-top: 10px;
}

</style>
