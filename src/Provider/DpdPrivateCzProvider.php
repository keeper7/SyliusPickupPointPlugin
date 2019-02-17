<?php declare(strict_types = 1);


namespace Setono\SyliusPickupPointPlugin\Provider;


use Setono\SyliusPickupPointPlugin\Client\DpdCzRestClient;
use Setono\SyliusPickupPointPlugin\Client\DpdCzRestClientInterface;
use Setono\SyliusPickupPointPlugin\Model\PickupPoint;
use Setono\SyliusPickupPointPlugin\Model\PickupPointInterface;
use Sylius\Component\Core\Model\OrderInterface;

class DpdPrivateCzProvider implements ProviderInterface {


    /**
     * Will return an array of pickup points
     * @param OrderInterface $order
     * @return array|PickupPointInterface[]
     */
    public function findPickupPoints(OrderInterface $order): array {
        $shippingAddress = $order->getShippingAddress();
        if (null === $shippingAddress) {
            return [];
        }

        /** @var DpdCzRestClientInterface $client */
        $client = $this->getClient();

        try {
            //$address = $shippingAddress->getCity() . '+' . $shippingAddress->getStreet() . '+' . $shippingAddress->getPostcode();
            //$result = $client->getParcelShopsByAddress($address);
            $result = $client->getAllParcelShops();
        } catch (\Exception $e) {
            return [];
        }

        $pickupPoints = [];
        $data = $result['data']['items'];
        foreach ($data as $item) {
            $pickupPoint = new PickupPoint(
                $item['id'],
                $item['company'],
                $item['street'] . ' ' . $item['house_number'],
                $item['postcode'],
                $item['city'],
                'CZ',
                (string) $item['latitude'],
                (string) $item['longitude']
            );
            $pickupPoints[] = $pickupPoint;

        }

        usort($pickupPoints, function($a, $b)
        {
            return strcmp($a->getCity(), $b->getCity());
        });

        return $pickupPoints;
    }

    /**
     * @param string $id
     * @return PickupPointInterface|null
     */
    public function getPickupPointById(string $id): ?PickupPointInterface {
        /** @var DpdCzRestClientInterface $client */
        $client = $this->getClient();

        try {
            $result = $client->getParcelShopById($id);
        } catch (\Exception $e) {
            return null;
        }

        $data = $result['data'];

        $pickupPoint = new PickupPoint(
            $data['id'],
            $data['company'],
            $data['street'] . ' ' . $data['house_number'],
            $data['postcode'],
            $data['city'],
            'CZ',
            (string) $data['latitude'],
            (string) $data['longitude']
        );

        return $pickupPoint;
    }


    /**
     * @return DpdCzRestClient
     */
    public function getClient(): DpdCzRestClient
    {
        return new DpdCzRestClient('http://pickup.dpd.cz/api/');
    }


    /**
     * {@inheritdoc}
     */
    public function getCode(): string
    {
        return 'dpd_private';
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return 'Dpd Pickup CZ';
    }

    /**
     * {@inheritdoc}
     */
    public function isEnabled(): bool {
        return true;
    }
}